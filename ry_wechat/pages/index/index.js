//index.js
var gd = getApp().globalData;//获取应用实例的全局变量
var util = require("/../../utils/util.js"); 
//获取应用实例
const app = getApp()

Page({
  selectHospitalTap:function(){
    wx.showToast({
      title: "该功能暂未开通",
      duration: 2000,
      image: '../../resources/images/error.png'
    })
    return;
  },
  bindVisitCard:function(){
    getApp().requestSend({
      url: 'patientRecharge/action/PatientRechargeActionC.jspx?',
      data: {
        op: 'queryPatientCharge',
        USER_ID: wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_USER_RECORD').USER_ID : '',
        USER_VS_ID: wx.getStorageSync('CURRENT_USER_RECORD') ? wx.getStorageSync('CURRENT_CUSTOM_PATIENT').USER_VS_ID : ''
      },
      header: {
        'content-type': 'application/json' //默认值
      },
      success: (res) => {
        if (res.data.success) {
          let visitCards = JSON.stringify(res.data.data);
          wx.navigateTo({
            url: '../patientCard/patientCard?visitCards=' + visitCards,
          })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
        console.log(res);
      },
      fail: (res) => {
        console.log("失败信息：", res);
      }
    });
  }
})
