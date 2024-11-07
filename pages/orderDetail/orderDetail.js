// pages/orderDetail/orderDetail.js
import api from '../../api/index.js'
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: {},
    orderId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('进入orderDetail页面了options:',options)
    let orderId = options.orderId
    this.setData({orderId: orderId})

    api.getOrderDetails(orderId).then(res=>{
      console.log(res)
      // const {address, createTime, orderId, productName, productQuant, recName, recPhone, storeId, address, recName, recPhone, warePhone, wareNickName, wareAddress} = res.data
      const detailRes = res.data
      detailRes.createTime = util.handleTime(detailRes.createTime)
      detailRes.wareAcpTime = util.handleTime(detailRes.wareAcpTime)
      this.setData({detailInfo: detailRes})
    })
  },
  // 司机接单
  driverAccept(){
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '确认接单？',
      success(res) {
        if (res.confirm) {
          that.sendDriverAcceptApi()
        }
      }
    })     
  },

  sendDriverAcceptApi: function(){
    api.driverAccept(this.data.orderId).then(res=>{
      console.log(res)
      if(res.code==0){
        wx.showModal({
          title: '温馨提示',
          content: '您已接单成功，点击确认跳转我的订单页',
          success(res) {
            if (res.confirm) {
             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              wx.switchTab({
                url: '../myOrder/myOrder',
              })
            }
          }
        })
      }else{
       wx.showModal({
         title: '温馨提示',
         content: res.message,
         success(res) {
           if (res.confirm) {
            //  wx.navigateBack()
            wx.switchTab({
              url: '../myOrder/myOrder',
            })
           }
         }
       })
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
    console.log('进入了orderDetail的onshow')
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

  },
  onTabItemTap(index){
    console.log('进入了orderDetail的onTabItemTap:', index)

  }
})