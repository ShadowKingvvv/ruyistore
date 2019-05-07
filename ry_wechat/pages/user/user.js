// pages/user/user.js
var gd = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryCustomPatient();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.queryCustomPatient();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 实名认证
   */
  verified: function() {
    wx.showModal({
      title: '实名认证',
      content: '就医前请先实名认证，实名认证后可以进行预约挂号，就诊卡充值，门诊缴费等一系列就医服务',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../authority/authority',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 获得就诊者
   */
  queryCustomPatient: function() {

    console.log(wx.getStorageSync("CURRENT_CUSTOM_PATIENT"));
    let self = this;
    let patientInfo = wx.getStorageSync("CURRENT_CUSTOM_PATIENT");
    if (patientInfo && patientInfo != null && patientInfo != "") {
      let uesrImgdef = "";
      if (patientInfo.header_img) {
        uesrImgdef = patientInfo.img;
      } else {
        if ("1" == patientInfo.SEX) {
          uesrImgdef = "../../resources/images/user_male.png";
        } else {
          uesrImgdef = "../../resources/images/user_female.png";
        }
      }
      patientInfo.idNoShow = self.getStarIdNo(patientInfo.ID_NO);
      patientInfo.phoneShow = self.getStarPhoneNum(patientInfo.PHONE);
      patientInfo.uesrImgdef = uesrImgdef;
      self.setData({
        hasPateient: true,
        curentPatientData: patientInfo
      });

    } else {
      self.setData({
        hasPateient: false
      });
      this.verified();
    }
  },

  /**
   * 查询全部就诊者
   */
  queryPatient: function() {
  
  },
  userInfo: function() {
    wx.showToast({
      title: "该功能暂未开通",
      duration: 2000,
      image: '../../resources/images/error.png'
    })
    return;
    wx.request({
      url: gd.serverUrl + 'messageCenter/action/MessageCenterActionC.jspx',
      data: {
        USER_LAST_DATE: null,
        LAST_DATE: null,
        USER_ID: wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_ID : '',
        USER_VS_ID: wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_VS_ID : ''
      },
      header: {
        'content-type': 'application/json' //默认值
      },
      success: (res) => {
        console.log(res);
        if (res.data.success) {
          let newsData = JSON.stringify(res.data.data.rows);
          wx.navigateTo({
            url: '../news/news?newsData=' + newsData,
          })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
      },
      fail: (res) => {
        console.log("失败信息：", res);
      }
    })
  },
  userAttentDoctor: function() {
    var util = require("/../../utils/util.js");
    if (!util.identityFilter()) {
      return;
    }
    getApp().requestSend({
      url: "/patientwords/action/PatientWordsActionC.jspx",
      data: {
        op: "queryMyCareList",
        userId: wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_ID : '',
        userVsId: wx.getStorageSync('CURRENT_CUSTOM_PATIENT') ? wx.getStorageSync('CURRENT_CUSTOM_PATIENT').USER_VS_ID : ''
      },
      success: (res) => {
        if (res.data.success) {
          let userDoctor = JSON.stringify(res.data.data);
         
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: (res) => {
        console.log("失败信息：", res);
      }
    })
  },
  appointmentList: function() {
    var util = require("/../../utils/util.js");
    if (!util.identityFilter()) {
      return;
    }
   
  },
  //将身份证号转换为****
  getStarIdNo: function(idNo) {
    if (idNo == null || idNo == undefined || idNo == '') {
      return;
    } else {
      let len = idNo.length;
      let head = idNo.substr(0, 3);
      let idNoS = head;
      let tail = idNo.substr(len - 4, 4);
      for (let i = 3; i < idNo.length - 4; i++) {
        idNoS = idNoS + '*';
      }
      idNoS = idNoS + tail;
      return idNoS;
    }
  },
  //将手机号转换为****
  getStarPhoneNum: function(phoneNum) {
    if (phoneNum == null || phoneNum == undefined || phoneNum == '') {
      return;
    } else {
      let len = phoneNum.length;
      let head = phoneNum.substr(0, 3);
      let phoneS = head;
      let tail = phoneNum.substr(len - 4, 4);
      for (let i = 3; i < phoneNum.length - 4; i++) {
        phoneS = phoneS + '*';
      }
      phoneS = phoneS + tail;
      return phoneS;
    }
  },
  goCardManage: function() {
    var util = require("/../../utils/util.js");
    if (!util.identityFilter()) {
      return;
    }
    // wx.navigateTo({
    //   url: '../patientCardList/patientCardList',
    // })
  },
  noOpenFun: function () {
    wx.showToast({
      title: "该功能暂未开通",
      duration: 2000,
      image: '../../resources/images/error.png'
    })
    return;
  },
})