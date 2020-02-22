Page({
  data: {
    userinfo: {},
    collectNum: 0
  },
  onLoad: function (options) {

  },
  onShow: function () {
    const userinfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect") || [];

    this.setData({
      userinfo,
      collectNum: collect.length
    })
  },
})