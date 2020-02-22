import { request } from "../../request/index.js";
Page({
  data: {
    // Tabs:自定义组件Tabs的数据
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      }, {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [],
    totalPages: 1,
  },
  // 接口要的参数
  QureyParams: {
    query: "",
    cid: "",
    pagenum: "1",
    pagesize: "10"
  },
  onLoad: function (options) {
    this.QureyParams.cid = options.cid||"";
    this.QureyParams.query = options.query||"";
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList() {
    const result = await request({ url: "/goods/search", data: this.QureyParams })
    const total = result.total;
    this.totalPages = Math.ceil(total / this.QureyParams.pagesize);
    this.setData({
      // 拼接的数组
      goodsList: [...this.data.goodsList, ...result.goods]
    })
    wx.stopPullDownRefresh();
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 获取被点击的标题的索引
    const { index } = e.detail;
    // 修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 赋值
    this.setData({
      tabs
    })
  },
  // 页面上滑 滚动条触底事件 
  onReachBottom() {
    // console.log("滚动条触底了！");
    if (this.QureyParams.pagenum >= this.totalPages) {
      wx.showToast({ title: '不要在滑了！' });
    } else {
      this.QureyParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.QureyParams.pagenum = 1;
    this.getGoodsList();
  }
})