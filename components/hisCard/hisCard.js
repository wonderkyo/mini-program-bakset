// components/myCard.js
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address: null,
    wareAddress: null,
    arriveTime: null,
    orderId: null,
    status: null,
  },
  // 监听
  observers: {
    'arriveTime': function (arriveTime) {
      this.setData({arriveTimeHandled: util.handleTime(arriveTime)})
    }
  },
  methods:{},
  /**
   * 组件的初始数据
   */
  data: {
    arriveTimeHandled: null
  },
})