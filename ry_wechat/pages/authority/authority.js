// pages/authority/authority.js
var gd = getApp().globalData;//获取应用实例的全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphonenum: "",
    getphone: false,
    getidNo: false,
    confirm: false,
    //类目ID
    firstID: "",
    secondID: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryId();
  },

  //获取类目ID方法
  getCategoryId: function () {
    wx.request({
      url: gd.wechatServerUrl + 'categoryId/getCategoryId',
      data: {
        appid: gd.appid,
      },
      header: {
        'content-type': 'application/json' //默认值
      },
      success: (result) => {
        console.log(result.data);
        console.log("类目first_id:", result.data.category_list[0].first_id);
        console.log("类目second_id:", result.data.category_list[0].second_id);
        this.setData({ firstID: result.data.category_list[0].first_id });
        this.setData({ secondID: result.data.category_list[0].second_id });
      }
    })
  },

  //点击获取手机号码按钮
  getPhoneNumber: function (e) {
    var that = this;
    wx.checkSession({
      success: function () {
        console.log("获取手机号码状态：", e.detail.errMsg);
        console.log("加密信息偏移量iv：", e.detail.iv);
        console.log("加密信息数据：", e.detail.encryptedData);
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          //用户不同意授权
          that.setData({
            modalstatus: true
          });
        } else {
          //用户同意授权
          var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js')
          var pc = new WXBizDataCrypt(gd.appId, gd.sessionKey);
          var data = pc.decryptData(e.detail.encryptedData, e.detail.iv);
          console.log('解密后的data: ', data);
          console.log("解密后的手机号码：", data.phoneNumber);
          //显示用户手机号
          that.setData({
            //加密处理
            userphonenum: data.phoneNumber.substring(0, 3) + '****' + data.phoneNumber.substring(7, 11),
            getphone: true
          });
          //设置用户手机号码的全局变量
          gd.userPhoneNumber = data.phoneNumber;
        }
      },
      fail: function () {
        console.log("session_key 已经失效，需要重新执行登录流程");
        //重新登录
        that.login();
      }
    })
  },

  //点击获取用户身份证号码
  authinfo: function (e) {
    wx.request({
      url: gd.wechatServerUrl + 'identity/get',
      data: {
        appid: gd.appid,
        auth_token: e.detail.auth_token,
        timestamp: Math.round(new Date().getTime() / 1000)
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res);
        //设置用户姓名和身份证号码的全局变量
        gd.userName = res.data.data.name;
        gd.userNo = res.data.data.idNumber;
        this.setData({
          getidNo: true,
          confirm: true
        });
        console.log(res);
        console.log("全局用户姓名：", gd.userName);
        console.log("全局用户身份证号码：", gd.userNo);
      }
    })
  },
  finishauthority:function(){

    getApp().openIdLogin(2);
  }
 

})