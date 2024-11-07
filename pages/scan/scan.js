import Toast from '@vant/weapp/toast/toast';
const app = getApp();
Page({
  data: {
    doorCode: '',
    userInfo: {}
  },
  onLoad() {
    this.scanCode()
  },
  scanCode() {
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        this.setData({ doorCode: res.result });
      },
      fail: (res) => {
        Toast({
          position: 'top',
          message: '扫码失败，请重新扫码或手动输入'
        });
      },
      complete: (res) => {
        console.log(res)
      },
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 确认事件
  async confirmFunc() {
    console.log(this.data.doorCode)
    // 校验doorCode
    app.globalData.doorCode = this.data.doorCode
    // if(typeof doorcode)
    // var doorInfo = await getDoorInfo({ doorInfo: doorcode });
    // console.log(doorInfo);
    wx.switchTab({
      url: '/pages/inspector/index',
    })
  }
})
