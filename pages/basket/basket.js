// pages/basket/basket.js
import api from '../../api/index.js'
import Toast from '@vant/weapp/toast/toast';
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myBasketInfo: {},
    totalAmount: 0,
    occupiedAmount: 0,
    freeAmount: 0,
    brokenAmount: 0,
    returnAmount: 0,
    lostAmount: 0,
    active: 0,
    returnBaksetList: [],
    basketList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.queryMyBasket()
    this.queryReturnBasket()
  },
  // 更新筐子状态
  updateBasketStatus(event){
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '确认丢失？',
      success(res) {
        if (res.confirm) {
          that.updateBaStatusFunc()
        }
      }
    }) 
  },
  modBasketStatus(val){
  //  if(val)
  },
  updateBaStatusFunc(e){
    const item = e.currentTarget.dataset.item; // 获取传递的item对象
    const currentRfid = item.basketRfid;
    api.modifyBasketStatus({
      basketRfid: item.basketRfid,
      status: this.modBasketStatus(item.basketStatus),
    }).then((res)=>{
      if (res?.message == 'OK') {
        wx.showToast({
          title: '处理成功！',
          icon: 'none'
        })
        this.queryMyBasket()
      }
    })
    
  },
 
  queryMyBasket() {
    api.queryMyBasket({ pageNo: 1, pageSize: 50 }).then(res => {
      if (res.code == 0) {
        if (res.data) {
          let {
            totalAmount = 0,
            occupiedAmount = 0,
            freeAmount = 0,
            brokenAmount = 0,
            returnAmount = 0,
            lostAmount = 0,
            basketList = []
          } = res.data
          if(basketList.length>0){
            basketList = basketList.map((item, index) => {
              return {
                id: index + 1,
                basketRfid: item.basketRfid,
                status: this.handleBasketStatus(item.status),
                updateTime: util.handleTime(item.updateTime),
              }
            })
          }
          this.setData({ totalAmount, occupiedAmount, freeAmount, brokenAmount, returnAmount, lostAmount, basketList })
        }
      }
    })
  },
  handleBasketStatus(status) {
    if (status == '1') {
      return '空闲'
    } else if (status == '2') {
      return '使用中'
    } else if (status == '3') {
      return '损坏'
    } else if (status == '4') {
      return '归还在途'
    } else if (status == '5') {
      return '丢失'
    } else {
      return ''
    }
  },
  changeTab(item) {
    // 切换tab就要重新查询一下
    console.log(item.detail)
    this.setData({ active: item.detail.index })
    if (item.detail.index == 1) {
      this.queryMyBasket()
    } else {
      this.queryReturnBasket()
    }
  },
  queryReturnBasket() {
    api.queryReturnBasket({ pageNo: 1, pageSize: 10 }).then(res => {
      console.log('res:', res)
      let listData = res?.data?.pageData.map((item, index) => {
        return {
          id: item.id,
          storeId: item.storeId,
          createTime: util.handleTime(item.createTime),
          basketListLen: JSON.parse(item.basketList).length,
          basketList: JSON.parse(item.basketList)
        }
      })
      console.log('listData', listData)
      // listData塞入
      this.setData({ returnBaksetList: listData })
    })
  },
  acceptReturnBasket(event) {
    const item = event.currentTarget.dataset.item
    api.acceptReturnBasket(item.id).then((res) => {
      console.log('chenggongle111111')
      Toast({
        position: 'middle',
        message: '确认成功！'
      });
      this.queryReturnBasket()
    })

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
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})