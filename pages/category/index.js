// 0、引入 用来发送请求的 方法,一定要把路径补全;import引入的是一种通过promise优化过的“异步请求”
import { request } from "../../request/index.js";
// 引入es7的”async“用的，现在版本的小程序勾选增强编译就可以不用引入了
// import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
  },
  // 接口的返回数据
  Cates: [],

  onLoad: function (options) {
    // 本地缓存接口数据------思路
    // 1、先判断本地存储中有没有旧数据 {time:Date.now(),data:[...]}
    // 2、没有旧数据 直接发送新请求
    // 2、有旧的数据 同时，旧的诗句没有过期 就使用本地存储中的旧数据即可
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据，定义过期时间 5分钟
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        })
      }
    }

  },
  // 获取分类数据-tarbar-分类页面
  async getCates() {
    // request({ url: "/categories" })
    //   .then(result => {
    //     this.Cates = result.data.message;
    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     // 构造右侧的商品数据
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent,
    //     })
    //   })
    // 1、使用es7的async await来发送请求
    const result = await request({ url: "/categories" });
    // this.Cates = result.data.message;
    this.Cates =  result;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent,
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 1、获取被点击的标题身上的索引
    // 2、给data中currentIndex复制
    // 3、根据不同的索引渲染右侧的商品内容
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的顶部距离
      scrollTop: 0,
    })
  },
})