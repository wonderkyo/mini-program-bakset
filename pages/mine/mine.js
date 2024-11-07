import api from '../../api/index.js'

// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile: {},
    phone: '',
    carNo: '',
    nickName: '',
    gender: '',
    genders: [
      { label: '保密', value: "0" },
      { label: '男', value: "1" },
      { label: '女', value: "2" },
    ],
    modifyFlag: true,
    showFlag: false,
    errorMessage: '',
    errorPhoneMessage: '',
    errorCarMessage: '',
    errorNameMessage: '',
    beforeClose: () => this.beforeClose
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onClose() {
    this.setData({
      errorPhoneMessage: '',
      errorCarMessage: '',
      errorNameMessage: ''
    })
    let { phone, carNo, nickName, gender } = this.data.profile
    this.setData({ phone, carNo, nickName, gender })
  },
  // 点击图标时触发的函数
  onClickIcon(event) {
    // 根据 event.currentTarget.dataset.name 判断是手机号还是车牌号
    const field = event.currentTarget.dataset.name;
    if (field === 'phone') {
      this.setData({ [field]: '' });
    } else if (field === 'carNo') {
      this.setData({ [field]: '' });
    }
  },

  onLoad(options) {
    this.setData({
      beforeClose: (action) => this.beforeClose(action)
    });
    this.refreshProfile()
  },
  refreshProfile() {
    api.getUserInfo().then(res => {
      let prof = res.data
      prof.gender = prof.gender + ''
      let { phone, carNo, nickName, gender } = prof

      prof.genderCN = this.data.genders.find((item) => item.value === gender)?.label ?? '未知'
      prof.roleCN = this.roleCNCalFunc(prof.role)
      this.setData({ profile: prof, phone, carNo, nickName, gender, nickName })
    })
  },
  onChange(event) {
    console.log(event)
    this.setData({
      gender: event.detail,
    });
  },
  modifyFunc() {
    this.setData({ showFlag: true })
  },
  validatePhone(phone) {
    const reg = /^1[3-9]\d{9}$/; // 简单的手机号正则表达式
    return reg.test(phone);
  },
  // 校验phone
  valiPhone() {
    if (!this.validatePhone(this.data.phone)) {
      this.setData({ errorPhoneMessage: '请输入有效的手机号' });
    } else {
      this.setData({ errorPhoneMessage: '' });
    }
  },
  // 车牌号校验函数
  validateCarNo(carNo) {
    const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z]{1}[A-HJ-NPQRTUWXY0-9]{4,5}[A-HJ-NPQRTUWXY0-9挂学警港澳]{1}$/; // 简单的车牌号正则表达式
    return reg.test(carNo);
  },
  // 校验carNo
  valiCarNo() {
    if (!this.validateCarNo(this.data.carNo)) {
      this.setData({ errorCarMessage: '请输入有效的车牌号' });
    } else {
      this.setData({ errorCarMessage: '' });
    }
  },
  beforeClose: function (action) {
    console.log(action)
    return new Promise((resolve) => {
      if (action == 'cancel') {
        resolve(true);
      } else {
        console.log('999999')
        if (!this.validatePhone(this.data.phone)) {
          this.setData({ errorPhoneMessage: '请输入有效的手机号' });
          resolve(false);
          return;
        } else {
          this.setData({ errorPhoneMessage: '' });
        }
        // 校验车牌号
        if (!this.validateCarNo(this.data.carNo)) {
          this.setData({ errorCarMessage: '请输入有效的车牌号' });
          resolve(false);
          return;
        } else {
          this.setData({ errorCarMessage: '' });
        }

        // 这里可以添加更新手机号和车牌号的逻辑
        api.updateProfile({ userId: this.data.profile.id, nickName: this.data.nickName, gender: this.data.gender, phone: this.data.phone, carNo: this.data.carNo }).then(res => {
          if (res.code == 0) {
            wx.showToast({
              title: '修改成功！',
              icon: 'success',
              duration: 700
            });
            resolve(true);
            this.refreshProfile()
          } else {
            wx.showToast({
              title: '修改失败',
              icon: 'error',
              duration: 700
            });
          }
        })
      }

    })
  },
  roleCNCalFunc(role) {
    if (role == 'admin') {
      return '管理员'
    } else if (role == 'driver') {
      return '司机'
    } else if (role == 'depot') {
      return '仓库'
    } else if (role == 'store') {
      return '商店'
    } else {
      return role
    }
  }
})