//app.js
var MD5 = require("/utils/MD5.js");
var util = require("/utils/util.js");
App({

  onLaunch: function() {
    //同步清除所有缓存
    wx.clearStorageSync()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //登陆时要用的token
    var token = new Date().getTime();
    wx.setStorageSync("TOKEN_4_FULL_CHECK", token);
    wx.setStorageSync("CURRENT_CUSTOM_PATIENT", '');
    wx.setStorageSync("CURRENT_USER_RECORD", '');
    this.getSessionKeyOpenId();

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    //正式环境
    serverUrl: "https://127.0.0.1:8080/RYProject",
    //wechatServerUrl: "https://weixin.quyiyuan.com/publicservice/",

    //测试环境
    wechatServerUrl: "http://127.0.0.1:8080/RYProject/",

    version: "2.5.30",

    hospitalId: "7980003",

    pst: "020542",

    //appid
    appid: "wx16d64be84489469b",

    sessionKey: '',

    userPhoneNumber: '', //s实名认证的手机号

    userName: '', //实名认证的用户姓名

    userNo: '', //实名认证的身份证号

    deptList: '',

    openId: '', //实名认证的openid
  },
  requestSend: function(cfg) {
    cfg.data.hospitalId = this.globalData.hospitalId;
    cfg.data.PUBLIC_SERVICE_TYPE = this.globalData.pst;
    cfg.url = this.globalData.serverUrl + cfg.url;
    cfg.data = this.prepareParams(cfg);
    cfg = this.getSuffix(cfg);
    console.log(cfg.url);
    console.log(cfg.data);
    this.send(cfg);
  },
  send: function(cfg) {
    if (cfg.SHOW_LOADING == false) {} else {
      wx.showLoading({
        title: '加载中',
      })
    }
    wx.request({
      url: cfg.url,
      data: cfg.data,
      header: {
        'content-type': 'application/json' //默认值
      },
      success: (res) => {
        wx.hideLoading()
        cfg.success(res);

      },
      fail: (res) => {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
        cfg.fail(res);

      }
    })
  },
  getSuffix: function(cfg) {
    //http 配置对象
    var config = {
      url: cfg.url,
      urlParamsString: '',
    };
    var paramurl = '';
    if (!util.isEmptyString(cfg.data)) {
      for (var itemPara in cfg.data) {
        if (cfg.data[itemPara] == undefined || cfg.data[itemPara] == null) {
          cfg.data[itemPara] = '';
        }
        let keyPara = this.encodeUriQuery(itemPara);
        let keyParaValue = this.encodeUriQuery(cfg.data[itemPara]);
        paramurl = paramurl + "&" + keyPara + "=" + keyParaValue;
      }
    }
    paramurl = paramurl.substring(1, paramurl.length);
    config.urlParamsString = paramurl;
    config.url = config.url + paramurl;
    var md5Para = MD5.encode(config.urlParamsString);
    var token = wx.getStorageSync('TOKEN_4_FULL_CHECK')
    cfg.data.QY_CHECK_SUFFIX = MD5.encode(md5Para + "@@" + token);
    return cfg;
  },
  encodeUriQuery: function(val, pctEncodeSpaces) {
    return encodeURIComponent(val);
    // .
    // replace(/%40/gi, '@').
    // replace(/%3A/gi, ':').
    // replace(/%24/g, '$').
    // //replace(/%2C/gi, ',').
    // replace(/%3B/gi, ';').
    // replace(/'/gi, '%27').
    // replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
  },
  prepareParams: function(config) {

    var me = this;
    //默认参数
    var default_params = {
      loc: "c",
      opVersion: this.globalData.version,
      //预约来源
      APPOINT_SOURCE: 0,
      isLogin: wx.getStorageSync('CURRENT_USER_RECORD') && wx.getStorageSync('CURRENT_USER_RECORD').USER_ID ? true : false,
      operateCurrent_UserId: wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_ID : '',
      operateUserSource: "0",
      hospitalID: this.globalData.hospitalId,
      USER_ID: wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_ID : '',
      USER_VS_ID: wx.getStorageSync('CURRENT_CUSTOM_PATIENT') ? wx.getStorageSync('CURRENT_CUSTOM_PATIENT').USER_VS_ID : '',
      PHONETYPE: this.getDeviceParam() && this.getDeviceParam().model ? this.getDeviceParam().model : "",
      PHONEVERSIONNUM: this.getDeviceParam() && this.getDeviceParam().version ? this.getDeviceParam().version : "",
      PHONEOPERATINGSYS: this.getDeviceParam() && this.getDeviceParam().PHONEOPERATINGSYS ? this.getDeviceParam().PHONEOPERATINGSYS : "",
      PUBLIC_SERVICE_TYPE: this.globalData.pst,
      //分组标识
      GROUP_CODE: 40
    };

    var params = {};
    if (default_params != undefined) {
      for (var name in default_params) {
        params[name] = default_params[name];
      }
    }
    if (config.data != undefined) {
      for (var name in config.data) {
        params[name] = config.data[name];
      }
    }

    // //过滤参数
    // var paramsWiper = config.paramsWiper;
    // if(paramsWiper != undefined){
    //
    //     for(var i in paramsWiper){
    //
    //         var expr = paramsWiper[i];
    //         if(params[expr] != undefined){
    //             params[expr] = undefined;
    //         }
    //     }
    // }

    return params;
  },
  /*获取系统参数
    brand	string	手机品牌	1.5.0
   model	string	手机型号
   pixelRatio	number	设备像素比
   screenWidth	number	屏幕宽度	1.1.0
   screenHeight	number	屏幕高度	1.1.0
   windowWidth	number	可使用窗口宽度
   windowHeight	number	可使用窗口高度
   statusBarHeight	number	状态栏的高度	1.9.0
   language	string	微信设置的语言
   version	string	微信版本号
   system	string	操作系统版本
   platform*/
  getDeviceParam: function() {
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "devtools") {
          res.PHONEOPERATINGSYS = "0";
        } else if (res.platform == "ios") {
          res.PHONEOPERATINGSYS = "2";
        } else if (res.platform == "android") {
          res.PHONEOPERATINGSYS = "1";
        }
        return res;
      },

    });

  },
  //通过wx.login接口获取code，并获取sessionKey和openId(利用微信后台调用腾讯API)
  getSessionKeyOpenId: function() {
    wx.login({
      success: (res) => {
        //登录成功，根据返回的code获取sessionkey和openid
        wx.request({
          method: "GET",
          url: this.globalData.wechatServerUrl + 'sessionkeyOpenIdController/sessionkeyOpenid',
          data: {
            js_code: res.code,
            appid: this.globalData.appid,
          },
          header: {
            'content-type': 'application/json' //默认值
          },
          success: (res) => {
            console.log("换取到的sessionKey和openid信息：", res);
            this.globalData.sessionKey = res.data.session_key;
            this.globalData.openId = res.data.openid;
            this.openIdLogin(1);
          }
        })
      }
    })
  },
  openIdLogin: function(type) {
    wx.setStorageSync("CURRENT_CUSTOM_PATIENT", '');
    wx.setStorageSync("CURRENT_USER_RECORD", '');
    console.log("失败信息：", "finishauthority");
    getApp().requestSend({
      url: 'user/action/LoginAction.jspx?',
      data: {
        op: "openIdLoginActionC",
        PHONE_NUMBER: this.globalData.userPhoneNumber,
        OPEN_ID: this.globalData.openId,
        NAME: this.globalData.userName,
        ID_NO: this.globalData.userNo,
        TOKEN: wx.getStorageSync('TOKEN_4_FULL_CHECK'),
        TYPE: type //1登陆2实名认证
      },
      success: (res) => {
        console.log(res);
        if (res.data.success) {

          //openid自动登录
          if (type === 1) {
            if (res.data.data == '') {
              wx.navigateTo({
                url: '../authority/authority',
              })
            } else {
              wx.setStorageSync("CURRENT_USER_RECORD", res.data.data);
              this.getSelectCustomInfo(type);
            }
          } else {
            //实名认证
            wx.setStorageSync("CURRENT_USER_RECORD", res.data.data);
            this.getSelectCustomInfo(type);
          }
        }
      },
      fail: (res) => {
        console.log("失败信息：", res);
      }

    })
  },
  getSelectCustomInfo: function(type) {
    var userid = wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_ID : ''
    getApp().requestSend({
      url: 'center/action/CustomPatientAction.jspx?',
      data: {
        op: "selectedCustomPatient",
        userId: userid
      },
      success: (res) => {
        console.log(res);
        if (res.data.success) {
          wx.setStorageSync("CURRENT_CUSTOM_PATIENT", res.data.data[0]);
          if (type !== 1) {
            wx.switchTab({
              url: '../user/user',
            })
          }
        }
      },
      fail: (res) => {
        console.log("失败信息：", res);
      }
    })
  }
})