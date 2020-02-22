import { request } from "../../request/index.js";
import { login } from "../../utils/asyncWx.js";

Page({
  data: {

  },
  onShow: function (options) {

  },
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      const { encryptedData, rawData, iv, signature } = e.detail;
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 发送请求，获取用户token值
      // const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      // 因为没有企业账号，所以这个请求会返回null，无法使用,所以导致真个支付无法使用（token值是从接口文档中"抄的"）
      wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
      
    }


  }
})