import { request } from "../../request/index.js";
Page({
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false

  },
  // 商品对象
  GoodsInfo: {},
  onShow: function () {
    let pages = getCurrentPages();
    let currentPages = pages[pages.length - 1];
    let options = currentPages.options
    const { goods_id } = options
    this.getGoodsDetial(goods_id);

  },
  // 获取商品的详情数据
  async getGoodsDetial(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;
    // collect收藏的商品，可能为数组，当数组为空时为字符串
    let collect = wx.getStorageSync("collect") || [];
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        // 这样写是为了，减少加载不必要的数据，优化小程序
        pics: goodsObj.pics,
        goods_price: goodsObj.goods_price,
        goods_name: goodsObj.goods_name,
        // iphone部分手机 不识别webp图片格式，最好找到后台，让他进行修改，临时自己改，确保后台存在1.webp=>1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
      },
      isCollect
    })
  },
  // 轮播图点击预览事件
  handlePrevewImage(e) {
    const url = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: url,
    });
  },
  // 点击加入购物车事件
  handleCartAdd() {
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在第一次添加
      this.GoodsInfo.num = 1;
      // 购物车是否选中属性
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
      console.log('if');
    } else {
      // 已经存在购物车数据 执行 num++
      cart[index].num++;
      console.log('else');
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // mask:true防止用户 手抖 疯狂点击按钮
      mask: true,
    });
  },
  // 点击商品详情页面的收藏图标
  handleCollect() {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 当index!=-1表示 已经收藏过
    if (index !== -1) {
      // 能找到，已经收藏过了
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        image: '',
        duration: 1500,
        mask: true,
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        image: '',
        duration: 1500,
        mask: true,
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })

  }
})