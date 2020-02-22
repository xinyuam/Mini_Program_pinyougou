// 0、引入 用来发送请求的 方法,一定要把路径补全;import引入的是一种通过promise优化过的“异步请求”
import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: [],
  },
  onLoad: function (options) {
    // 同时发送了三个异步请求
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result,
        });
      })
  }
})