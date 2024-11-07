// components/myCard.js
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address: null,
    wareAddress: null,
    productName: null,
    productQuant: null,
    createTime: null,
    orderId: null
  },
  // 监听
  observers: {
    'createTime': function (createTime) {
      this.setData({createTimeHandled: util.handleTime(createTime)})
    }
  },
  methods:{
    gotoDetail(){
      wx.navigateTo({
        url: '../orderDetail/orderDetail?orderId='+this.properties.orderId,
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
     createTimeHandled: null
  },
})