var API_BASE_URL = 'http://192.168.1.6:8085';
const app = getApp()
const SUCCESS_CODES = [0, 200]

var request = function request(url, method, data) {
  var _url = API_BASE_URL + url;
  var header = {
    'Content-Type': 'application/json'
  };
  if (app.globalData.accessToken) {
    header.Authorization = 'Bearer ' + app.globalData.accessToken
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      success: function success(res) {
        console.log(`${url}:`, res.data)
        const { code, message } = res.data;
        if (!SUCCESS_CODES.includes(code)) {
          console.log('不是正确的code');
          // wx.showToast({
          //   title: message,
          //   icon: 'error',
          //   duration: 500
          // });
          resolve(res.data);
        } else {
          resolve(res.data);
        }
      },
      fail: function fail(error) {
        console.log('fail了', error);
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });
  });
};

var uploadFile = function uploadFile(url, filePath, name, formData) {
  var _url = API_BASE_URL + url;
  var header = {
    'Content-Type': 'multipart/form-data'
  };
  if (app.globalData.accessToken) {
    header.Authorization = 'Bearer ' + app.globalData.accessToken
  }
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      filePath: filePath,
      name: name,
      url: _url,
      header: header,
      formData: formData,
      success: function success(res) {
        console.log(`${url}:::`, res.data)
        const { code } = JSON.parse(res.data);
        if (!SUCCESS_CODES.includes(code)) {
          console.log('不是正确的code', code);
          wx.showToast({
            title: '图片上传失败',
            icon: 'error',
            duration: 500
          });
          resolve(JSON.parse(res.data));
        } else {
          resolve(JSON.parse(res.data));
        }
      },
      fail: function fail(error) {
        console.log('fail了', error);
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });
  })
}

module.exports = {
  request: request,
  uploadFile: uploadFile,
  uploadImg: function uploadImg(filePath, nameStr, formData) {
    return uploadFile('/orderDrivers/uploadImg', filePath, nameStr, formData)
  },
  queryMobileLocation: function queryMobileLocation() {
    var mobile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return request('/common/mobile-segment/location', false, 'get', { mobile: mobile });
  },
  login: function login(data) {
    return request('/auth/login', 'post', data)
  },
  // 查询司机可以接单的
  queryUnDriverOrders: function queryUnDriverOrders(data) {
    return request('/order/queryOrders', 'post', data)
  },
  // 查询订单详情
  getOrderDetails: function getOrderDetails(orderId) {
    return request('/order/getOrderDetails', 'get', { orderId: orderId })
  },
  // 司机接单
  driverAccept: function driverAccept(orderId) {
    return request('/orderDrivers/driverAccept', 'get', { orderId: orderId })
  },
  // 查询司机已经接过的订单
  queryDriversOrder: function queryDriversOrder(data) {
    return request('/orderDrivers/queryDriversOrder', 'post', data)
  },
  // 更新orderDriver的时间
  updateOrderDriverTime: function updateOrderDriverTime(data) {
    return request('/orderDrivers/updateOrderDriverTime', 'post', data)
  },
  queryDriverHisOrders: function queryDriverHisOrders(data) {
    return request('/orderDrivers/queryDriverHisOrders', 'post', data)
  },
  // 查询名下的周转筐：
  queryMyBasket: function queryMyBasket(data) {
    return request('/basket/queryMyBasket', 'post', data)
  },
  // 查询需要确认的周转筐归还请求
  queryReturnBasket: function queryReturnBasket(data) {
    return request('/basketReturn/queryReturnBasket', 'post', data)
  },
  // 修改周转筐状态和使用者
  modifyBatchBasket: function modifyBatchBasket(data){
    return request('/basket/modifyBatchBasket', 'post', data)
  },
  // 接收归还申请
  acceptReturnBasket: function acceptReturnBasket(returnId){
    return request('/basket/acceptReturnBasket', 'get', { returnId: returnId })
  },
  // 获取用户信息
  getUserInfo: function getUserInfo(){
    return request('/user/detail', 'get', {})
  },
  // 更改用户信息
  updateProfile: function updateProfile(data){
    return request('/user/updateProfileDriver', 'post', data)
  },
  updateDriverLoc: function updateDriverLoc(data){
    return request('/user/updateDriverLoc', 'get', { locData: data })
  }
}