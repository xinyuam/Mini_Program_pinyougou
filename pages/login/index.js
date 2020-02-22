// pages/login/index.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  handleGetUserInfo(e) {
    const { userInfo } = e.detail;
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})