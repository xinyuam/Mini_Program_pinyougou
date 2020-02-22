import { request } from "../../request/index.js";
Page({
  data: {
    goods: [],
    // 取消按钮是否显示
    isFocus: false,
    // 输入框的值
    inputValue: ""
  },
  Timeid: -1,
  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    const { value } = e.detail;
    // 检测合法性，trim方法：去除字符串的头尾空格
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      });
      // 值不合法
      return;
    }
    this.setData({
      isFocus: true
    })

    // 这里还有一个bug    
    // 举例：当输入“荣耀”，会发送一个“荣耀的请求”
    // 当删除“荣耀”时候，还会发送一个“荣”的请求
    // 并且将返回结果渲染在页面上，
    // 还有一个bug，例：当输入“荣耀”
    // 打字慢了，会发送一个”荣“和一个”荣耀“的请求
    // 先发 荣 后发 荣耀 的请求
    // 但当”荣耀“的请求比“荣”先返回结果
    // 那么，在页面渲染的就是“荣”而不是“荣耀”了
    // 暂时没有想到好的解决方案，暂留：20200220-1334，一神

    // 防止抖动
    clearTimeout(this.Timeid);
    this.Timeid = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
    // 发送请求/goods/qsearch -query:关键字    
  },
  // 发送请求，获取搜索建议 数据
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      goods: res
    });
  },
  // 点击取消按钮
  handleCancel() {
    this.setData({
      inputValue: "",
      isFocus: false,
      goods: []
    });
  }
})