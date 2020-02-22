Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片数组
    chooseImgs: [],
    // 文本域的内容
    textValue: ""
  },
  // 此数据不需要再page中显示，外网的图片的路径数组
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    });
  },
  // ”+“按钮的点击事件 ，选择图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接(多次长传的图片拼接为一个数组，而不是第二次的图片覆盖第一次的图片)
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        });
      },
    });
  },
  // 点击自定义图片组件，进行删除图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    });
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({      
      textValue: e.detail.value
    })
  },
  // 按钮的点击事件，提交表单
  handleFormSubmit(e) {
    const { textValue, chooseImgs } = this.data;
    // 合法性的验证
    if (!textValue.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      return;
    }
    // 显示正在等待图片上传
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });
    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      // 遍历图片数组，一张一张上传
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 接口说明地址： https://images.ac.cn/doc/upload
          url: 'https://images.ac.cn/api/upload?apiType=ali&Token=cf7325e50aac9cb56c2771b2e210',
          filePath: v,
          name: "image",
          success: (result) => {
            let url = JSON.parse(result.data).data.url.ali;
            this.UpLoadImgs.push(url);
            console.log(this.UpLoadImgs);
            //  所有的图片都上传完毕了才触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              // 仅仅模拟，因为没有具体接口来时实现
              console.log("把文本的内容和外网的图片数组，提交到后台中");
              // 提交都成功了，重置页面
              this.setData({
                textValue: "",
                chooseImgs: []
              });
              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
      });
    } else {
      console.log("只是提交了文本");
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
  }
})