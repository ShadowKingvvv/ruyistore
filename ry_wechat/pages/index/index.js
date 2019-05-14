//index.js
var gd = getApp().globalData;//获取应用实例的全局变量
var util = require("/../../utils/util.js"); 
//获取应用实例
const app = getApp()

Page({
  /**
 * 页面的初始数据
 */
  data: {
    // banner
    banner:{
      imgUrls: [
        '../../resources/image/banner-1.png',
        '../../resources/image/banner-2.png'
      ],
      indicatorDots: true, //是否显示面板指示点
      autoplay: true, //是否自动切换
      interval: 3000, //自动切换时间间隔,3s
      duration: 1000 //  滑动动画时长1s
    },
    Height: '',
    oIndex: 0,
    left: 0,
    product_list: [
      { iconfont: 'icon-shouye-', text: '首页', color:'#1fa7a8'},
      { iconfont: 'icon-zhubao', text: '珠宝', color: '#fbe433'},
      { iconfont: 'icon-bowlder-2', text: '玉石', color: '#1eba84'},
      { iconfont: 'icon-weishoucang-', text: '收藏', color: '#d85052' },
      { iconfont: 'icon-fenlei-', text: '分类', color: '#1afa29'}]
  },
  imgHeight: function (e) {
      var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
      var imgh = e.detail.height;//图片高度
      var imgw = e.detail.width;//图片宽度
      var swiperH = winWid * imgh / imgw + "px !important";
      //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
      this.setData({
        Height: swiperH //设置高度
      })
  },
  switchTab: function (e) {
    var oIndex = e.currentTarget.dataset.index;
    var oLeft = e.currentTarget.offsetLeft;
    if (oLeft == 327) {
      this.setData({
        left: 327,
      })
    } else if (oLeft == 0) {
      this.setData({
        left: 0,
      })
    }
    this.setData({
      oIndex: oIndex
    })
  },
  searchProject:function(){
    wx.navigateTo({
      url: '../searchProject/searchProject',
    });
  },
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
