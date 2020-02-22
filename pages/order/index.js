import { request } from "../../request/index.js";
Page({
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      },
    ]

  },
  onShow: function () {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    // 获取页面栈
    let pages = getCurrentPages();
    console.log(pages);
    // Pages数据中，索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1]
    const { type } = currentPage.options;
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    this.setData({
      orders: res.orders.map(v => ({ ...v, create_time_cn: new Date(v.create_time * 1000).toLocaleString() }))
    })
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求 当type = 1，index = 0；
    this.getOrders(index + 1);
  }
})