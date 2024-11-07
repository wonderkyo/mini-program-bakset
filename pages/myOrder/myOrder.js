// pages/myOrder/myOrder.js
import api from '../../api/index.js'
const QQ_MAP_KEY = 'P3NBZ-6VK3Z-GRAXW-ZEH42-BC2FQ-WFFNJ'
const util = require('../../utils/util.js')
import Dialog from '@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: {},
    orderId: null,
    showEmptyFlag: true,
    active: 0,
    // 已完成的订单的数据
    orderHisList: [], // 展示用的list
    pageNo: 1,
    pageSize: 10,
    showBtnFlag: false,
    fileListDisplay: [],
    imgList: ['E:\\wxPics\\1728472053129_TFzAdNY6y0ewa3478409f0e45b055fcf7fb797029de4.jpg', 'E:\\wxPics\\1728472053129_TFzAdNY6y0ewa3478409f0e45b055fcf7fb797029de3.jpg'], // 传完了之后用来展示的
    imgListHttp: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // console.log('进入了myOrder了开始onload了')
    // this.queryDriversOrder()
  },
  // 点击图片
  onImageClick(event) {
    const src = event.currentTarget.dataset.src;
    console.log('srcrrrr:', event.currentTarget)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: this.data.imgListHttp // 需要预览的图片http链接列表
    });
  },
  // 上传图片
  afterRead(event) {
    const { file } = event.detail;
    if (this.data.fileListDisplay.length >= 3) {
      wx.showToast({
        title: '最多只能上传3张图片',
        icon: 'none'
      });
      return;
    }
    // file.status = 'uploading'
    // file.message = '上传中'
    this.setData({
      fileListDisplay: [...this.data.fileListDisplay, file]
    });
    console.log('file是什么：', file)
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  },
  afterDelete(event) {
    const index = event.detail.index;
    const newFileList = this.data.fileListDisplay.filter((item, idx) => idx !== index);
    this.setData({
      fileListDisplay: newFileList
    });
  },

  changeTab(item) {
    // index:0, name:0, title:待提货
    console.log(item.detail)
    this.setData({ active: item.detail.index })
    if (item.detail.index == 1) {
      this.setData({ orderHisList: []})
      this.setData({ pageNo: 1})
      this.queryDriverHisOrders()
    }
  },
  queryDriverHisOrders() {
    api.queryDriverHisOrders({ pageNo: this.data.pageNo, pageSize: this.data.pageSize }).then((res) => {
      console.log('queryDriverHisOrders:', res)
      let { total = 0, pageData } = res?.data
      console.log('total:', total)
      this.setData({ orderHisList: this.data.orderHisList.concat(pageData) })
      // 判断要不要展示触底
      if (this.data.pageNo * this.data.pageSize >= total) {
        this.setData({ showBtnFlag: true })
      } else {
        this.setData({ showBtnFlag: false })
      }
    })
  },
  // 去提货
  gotoGuide() {
    console.log('inytotortortoerot')
    // 去送货的，目的地址是门店address
    if (this.data.detailInfo.driverStartTime) {
      const { address } = this.data.detailInfo
      this.getLuJingGuiHua(address)
    } else {
      // 去提货的，目的地址是仓库
      const { wareAddress } = this.data.detailInfo
      this.getLuJingGuiHua(wareAddress)
    }
  },
  // 已送达
  updateArriveTime() {
    // Dialog.alert({
    //   title: '温馨提示',
    //   message: '筐子选择带走吗',
    //   showCancelButton: true,
    //   confirmButtonText: '留在门店',
    //   cancelButtonText: '带走',
    //   theme: 'round-button',
    // }).then(() => {
    //   // on close
    // });
    api.updateOrderDriverTime({ updateType: 'arrive', orderId: this.data.detailInfo.orderId }).then((res) => {
      wx.showToast({
        title: '送货成功',
        icon: 'success'
      })
      this.setData({ active: 1 })
      this.queryDriversOrder()
    })
  },
  // 已取到货物
  updateStartTime() {
    if(!this.data.detailInfo.wareOutTime){
      wx.showToast({
        title: '仓库还没出库呢',
        icon: 'error'
      })
      return
    }
    const that = this
    const fileList = this.data.fileListDisplay
    if(fileList.length == 0){
      wx.showToast({
        title: '上传取货图片',
        icon: 'error'
      })
      return
    }
    const uploadTasks = fileList.map((file) => {
      return new Promise((resolve, reject) => {
        api.uploadImg(file.url, 'file', { orderId: this.data.detailInfo.orderId }).then(res => {
          console.log('orderDrivers/uploadImg:', res)
          if (res.code == 0) {
            resolve(res.data);
            that.setData({
              fileListDisplay: fileList
            })
          } else {
            reject(res)
          }
        })
      })
    })


    Promise.all(uploadTasks).then((res) => {
      console.log('promise-all-res:', res)
      let imgList = res.join(',')

      console.log('imgListimgListimgList:', imgList)
      Promise.all([
        api.modifyBatchBasket({ orderId: this.data.detailInfo.orderId }),
        api.updateOrderDriverTime({ updateType: 'start', orderId: this.data.detailInfo.orderId, imgList: imgList })
      ]).then((res) => {
        if (res[0].code == 0 || res[0].code == 200) {
          wx.showToast({
            title: '取货成功',
            icon: 'success'
          })
          this.setData({
            fileListDisplay: []
          });
          this.queryDriversOrder()
        } else {
          wx.showToast({
            title: '取货失败，请重试',
            icon: 'success'
          })
        }
      })
    })
  },
  getLuJingGuiHua(addr) {
    let endPoint = { name: addr, latitude: null, longitude: null }
    this.getLocFromQQMap(addr).then(res => {
      endPoint.latitude = res?.result?.location?.lat;
      endPoint.longitude = res?.result?.location?.lng;
      // 开始导航
      let plugin = requirePlugin('routePlan');
      let referer = '周转筐司机接单001';   //调用插件的app的名称
      wx.navigateTo({
        url: `plugin://routePlan/index?key=${QQ_MAP_KEY}&referer=${referer}&endPoint=${JSON.stringify(endPoint)}&navigation=1`
      });
    })
  },
  queryDriversOrder() {
    api.queryDriversOrder().then(res => {
      if (res.code == 0) {
        console.log('看看flag：', res.data)
        if (res.data) {
          console.log('intointointo----false')
          this.setData({ showEmptyFlag: false })
          console.log('进来了')
          const detailInfo = res.data
          if(detailInfo.imgList){
            let imgListRes = detailInfo.imgList.split(',')
            imgListRes = imgListRes.map(item => "http://192.168.1.6:8085/auth/image/" + item)
            this.setData({ imgListHttp: imgListRes })
          }
         
          detailInfo.createTime = util.handleTime(detailInfo.createTime)
          detailInfo.wareAcpTime = util.handleTime(detailInfo.wareAcpTime)
          detailInfo.driverAcpTime = util.handleTime(detailInfo.driverAcpTime)
          detailInfo.driverStartTime = util.handleTime(detailInfo.driverStartTime)
          detailInfo.basketList = JSON.parse(detailInfo.basketList)
          this.setData({ detailInfo: res.data })
        } else {
          console.log('是空的')
          // 没有订单显示一个空
          this.setData({ showEmptyFlag: true })
        }
      } else {
        // 报错
      }
    })
  },
  getLocFromQQMap(address) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: `https://apis.map.qq.com/ws/geocoder/v1?address=${address}&key=${QQ_MAP_KEY}`,
        method: 'GET',
        success: function success(res) {
          resolve(res.data)
        },
        fail: function fail(error) {
          reject(error)
        }
      })
    })
  },
  // 跳转到导航
  gotoGuide000() {
    const { wareAddress, address } = this.data.detailInfo
    let fromPoint = { name: wareAddress, latitude: null, longitude: null }
    let endPoint = { name: address, latitude: null, longitude: null }
    Promise.all([this.getLocFromQQMap(wareAddress), this.getLocFromQQMap(address)]).then(res => {
      console.log('promise-all：', res)
      fromPoint.latitude = res[0]?.result?.location?.lat;
      fromPoint.longitude = res[0]?.result?.location?.lng;
      endPoint.latitude = res[1]?.result?.location?.lat;
      endPoint.longitude = res[1]?.result?.location?.lng;

      // 开始导航
      let plugin = requirePlugin('routePlan');
      let referer = '周转筐司机接单001';   //调用插件的app的名称
      wx.navigateTo({
        url: `plugin://routePlan/index?key=${QQ_MAP_KEY}&referer=${referer}&startPoint=${JSON.stringify(fromPoint)}&endPoint=${JSON.stringify(endPoint)}&navigation=1`
      });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('触发了onshow')
    this.setData({ active: 0 })
    this.queryDriversOrder()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.active == 1 && !this.data.showBtnFlag) {
      console.log('shuaxinlema ')
      this.setData({ pageNo: this.data.pageNo + 1 })
      this.queryDriverHisOrders()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})