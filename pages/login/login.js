// login.js
import api from '../../api/index.js'
const app = getApp()
Page({
  data: {
    username: '司机0002',
    password: 'siji002',
    // username: '司机0001',
    // password: 'siji123',
    // username: 'siji002',
    // password: 'siji002',
  },
  onLoad() {
  },
  gotoLogin() {
    const { username, password } = this.data
    console.log(username, password)
    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    api.login({ username, password, isQuick: true }).then(res => {
      console.log('111', res.data.accessToken)
      app.globalData.accessToken = res.data.accessToken
      console.log('22222')
      wx.switchTab({
        url: '../orderList/orderList',
      })
      // let IPStr = JSON.stringify({ lat: 30.51311, lng: 114.418862 })
      // api.updateDriverLoc(IPStr)
      console.log('33333')
    })
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
})
