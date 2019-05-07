// pages/guideline/guideline.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floorData:'',
    hospitalPhoto:'',
    showModal:false,
    deptName:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let floorData = JSON.parse(options.floor);
    console.log(floorData[0].HOSPITAL_FLOOR_PHOTO);
    self.setData({
      floorData: floorData,
      hospitalPhoto: floorData[0].HOSPITAL_FLOOR_PHOTO
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  floorNumber: function(event){
    console.log(event.currentTarget.dataset['name']);
    var deptName = event.currentTarget.dataset['name']
    this.setData({
      showModal: true,
      deptName: deptName
    })
    
  },
  go: function () {
    this.setData({
      showModal: false
    })
  }
})