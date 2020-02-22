import { getSetting, openSetting, chooseAddress, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow: function (options) {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    // 过滤购物车数据，仅保存打钩的
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  async handleOrderPay(e) {
    try {

      // 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      console.log("已经存在token");
      // 开始创建订单      
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_number,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      // 发送请求，创建订单，获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
      // 预支付
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // 调用微信支付
      await requestPayment(pay);
      // 订单支付状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      await showToast({ title: "支付成功" });
      // 删除缓存中 已经支付了的商品数据
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      wx.navigateTo({
        url: '/pages/order/index',
      });

    } catch (error) {

      await showToast({ title: "支付失败" });
      console.log(error);


    }
  }
})