// pages/orderList/orderList.js
import api from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 展示用的list
    pageNo: 1,
    pageSize: 10,
    showBtnFlag: false,
    fileListDisplay: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('进入onload了')
    // this.getOrderList();
  },
  // 下拉触底
  onReachBottom: function () {
    if (!this.data.showBtnFlag) {
      console.log('shuaxinlema ')
      this.setData({ pageNo: this.data.pageNo + 1 })
      this.getOrderList()
    }
  },
  // 获取司机可以接单的订单
  getOrderList(isFresh) {
    api.queryUnDriverOrders({ queryStatus: 'wareAcp', pageNo: this.data.pageNo, pageSize: this.data.pageSize }).then(res => {
      if (res.code == 0) {
        let totalNum = res?.data?.total || 0
        if (isFresh) {
          // 刷新
          this.setData({ orderList: res.data.pageData })
          // 判断要不要展示触底
          if (this.data.pageNo * this.data.pageSize >= totalNum) {
            this.setData({ showBtnFlag: true })
          } else {
            this.setData({ showBtnFlag: false })
          }
        } else {
          // 加载更多
          this.setData({ orderList: this.data.orderList.concat(res.data.pageData) })
          // 判断要不要展示触底
          if (this.data.pageNo * this.data.pageSize >= totalNum) {
            this.setData({ showBtnFlag: true })
          } else {
            this.setData({ showBtnFlag: false })
          }
        }
      }
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
    console.log('进了onshow')
    this.setData({ showBtnFlag: false })
    this.setData({ pageNo: 1 })
    this.getOrderList(true)
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
    this.setData({ showBtnFlag: false })
    this.setData({ pageNo: 1 })
    this.getOrderList(true)
  },
})