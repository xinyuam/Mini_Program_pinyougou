import { getSetting, openSetting, chooseAddress, showModal, showToast } from "../../utils/asyncWx.js"
Page({
  data: {
    address: {},
    cart: [],
    allchecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow: function (options) {
    const address = wx.getStorageSync("address");
    // 获取本地缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // every数组方法：会遍历 会接收一个回调函数，那么每一个回调函数都返回true，every方法的返回值为true，数组为空，也返回true
    // const allchecked = cart.length ? cart.every(v => v.checked) : false;
    this.setData({
      address
    })
    this.setCart(cart);
  },
  onLoad: function (options) {
  },
  // 获取收货地址
  async handleChooseAddress() {
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 调用获取收货地址的api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 将地址信息存入缓存
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  // 购物车的选择框
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;
    let { cart } = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车状态同时重新计算底部工具栏的数据，全选-总价格-购买的数量,并且更新缓存中的数据
  setCart(cart) {
    // 开始修改缓存中的cart数据
    let allchecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allchecked = false
      }
    });
    allchecked = cart.length != 0 ? allchecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allchecked
    });
    wx.setStorageSync("cart", cart);
  },
  // 底部工具篮的全选按钮点击事件
  handleItemaAllChange() {
    // 获取data中的数据
    let { cart, allchecked } = this.data;
    allchecked = !allchecked;
    // 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allchecked);
    this.setCart(cart);
  },
  // 商品数量的增加、减少事件
  async handleItemNumEdit(e) {
    const { id, operation } = e.currentTarget.dataset;
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "是否删除该商品?" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  // 点击结算按钮
  async handlePay() {
    const { address, totalNum } = this.data;
    // 判断有没有填写收获地址
    if (!address.userName) {
      await showToast({ title: "请添加收获地址" })
      return;
    }
    // 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
    // 跳转支付界面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})