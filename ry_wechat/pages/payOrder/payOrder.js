// pages/payOrder/payOrder.js
var util = require("/../../utils/util.js");
var gd = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payData: '',
    windowWidth: util.getScreenSize().windowWidth - 40,
    showPaytype: '',
    cancleflag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let payData = JSON.parse(options.payData);
    this.setData({
      payData: payData
    })
    this.getPayType();

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
    if(!this.data.cancleflag){
      this.cancelPayOrder(this.data.payData);
    }
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
  //支付
  goToPay: function() {
    var self = this;
    if (this.data.payData.flag == '1' || this.data.payData.flag == '2' || this.data.payData.flag == '3') {
      this.afterPay();
    }
    getApp().requestSend({
      url: "apppay/action/PayActionC.jspx",
      data: {
        op: 'payHandle',
        TRADE_NO: this.data.payData.TRADE_NO,
        AMOUNT: this.data.payData.AMOUNT,
        TRANS_CODE: '01',
        PAY_TYPE: 63,
        openId:gd.openId
      },
      success: (res) => {
        var data = res.data;
        if (data.success) {
          this.setData({
            cancleflag: true//支付完成则认为不是会退。否则会退是需要取消订单的
          }) 
          var result = data.data;
          wx.requestPayment({
            appId: result.appId,
            timeStamp: result.timeStamp,
            nonceStr: result.nonceStr,
            package: result.package,
            signType: result.signType,
            paySign: result.paySign,
            success(res) {          
              if (self.data.payData.flag == undefined) {
                
              } else {
                //预约挂号支付完成
                let appointRecord = {
                  HOSPITAL_ID: gd.hospitalId,
                  REG_ID: self.data.payData.C_REG_ID
                }
                let appointRecordJson = JSON.stringify(appointRecord);
                wx.redirectTo({
                  url: '../appointResult/appointResult?appointRecord=' + appointRecordJson,
                })
              }
            },
            fail(res) {
              wx.showToast({
                title: '失败',
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }

      },
      fail: (res) => {}
    });

  },
  afterPay: function() {
    getApp().requestSend({
      url: "appoint/action/AppointActionC.jspx",
      showLoading: false,
      data: {
        op: 'updatePayStatusByAppRegTypeActionC',
        C_REG_ID: this.data.payData.C_REG_ID,
        HOSPITAL_ID: gd.hospitalId
      },
      success: (res) => {

      },
      fail: (res) => {}
    });
  },
  //获取支付方式
  getPayType: function() {
    var businessType = '';
    var router = this.data.payData.ROUTER;
    var cardNo = this.data.payData.CARD_NO;
    var cardType = this.data.payData.CARD_TYPE; //KYEEAPPC-7818
    businessType = this.getBusinessType(this.data.payData);
    if (this.data.payData.flag) {
      cardNo = this.data.payData.CARD_NO;
      if (cardNo == '') {
        //表示申请新卡预约挂号
        cardNo = -1;
      } else {
        //后台自己查询卡号
        cardNo = '';
      }
    }
    getApp().requestSend({
      url: "payment/action/PaymentActionC.jspx",
      data: {
        publicServiceType: gd.publicServiceType,
        hospitalID: gd.hospitalId,
        userSource: gd.userSource,
        CARD_NO: cardNo,
        CARD_TYPE: cardType,
        IS_SHOW: this.data.payData.isShow,
        BUSINESSPAYTYPE: businessType,
        MASTER_ID: this.data.payData.MASTER_ID,
        TRADE_NO: this.data.payData.TRADE_NO,
        PRE_PAY_MARK: this.data.payData.PRE_PAY_MARK, //抢号预付费标识;1表示是预付费数据
        IS_APPLET: '1', //1代表微信
        op: "getPaymentMethod"
      },
      success: (res) => {
        if (res.data.success) {
          var resultData = res.data;
          var paytype = [];
          if (resultData.data.payStyle) {
            paytype = JSON.parse(resultData.data.payStyle);
          }
          var showPaytype = '';
          for (var i = 0; i < paytype.length; i++) {
            if (paytype[i].ITEM_VALUE == '63') {
              showPaytype = paytype[i];
              break;
            }
          }
          this.setData({
            showPaytype: showPaytype
          })
        }
      },
      fail: (res) => {}
    });
  },
  //获取businessType
  getBusinessType: function(payData) {
    var businessType;
    var router = payData.ROUTER;
    if (payData.flag == undefined) {
      //增加新版住院预缴 KYEEAPPC-6601
      if (router == 'inpatient_payment_pay_info' || router == 'perpaid_record' || router == 'inPerpaid_record') {
        //住院业务
        businessType = 2;
      } else if (router == 'recharge_records' || router == 'patient_card_records') {
        // KYEEAPPC-8088 程铄闵 2.3.10充值功能改版
        //添加就诊卡充值个性化支付方式  KYEEAPPC-2625  By  章剑飞
        businessType = 3;
      } else if (router == 'medicineOrder') {
        businessType = 4;
      } else {
        //普通支付
        businessType = 1;
      }
    } else {
      //预约挂号支付
      businessType = 0;
    }
    return businessType;
  },
  cancelPayOrder: function (payData) {
    //begin 取消订单合并
    var me = this;
    //取消订单
    getApp().requestSend({
      url: "appoint/action/AppointActionC.jspx",
      data: {
        op: 'cancelPayOrder',
        TRADE_ORDER_NO: payData.TRADE_NO,
        hospitalID: gd.hospitalId,
        IS_RUSH_RECORD: payData.IS_RUSH_RECORD,
        IS_VIP_APPOINT: payData.IS_VIP_APPOINT
      },
      success: (res) => {
        wx.navigateBack({
          delta: 1
        })
      },
      fail: (res) => { }
    });
    //end 取消订单合并 
  }
})