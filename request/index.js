// 同时发送异步请求代码的次数
let ajaxTimes = 0;
// Promise技术,用来优化发送异步请求获取轮播图数据
export const request = (params) => {
    // 判断URL中是否带有 /my/请求的是私有的路径 地上header token
    let header = {...params.header};
    if (params.url.includes("/my/")){
        // 拼接header 带上token
        header["Authorization"]= wx.getStorageSync("token");
        // 下面的token是接口页面里找到的,因为没有企业微信账号，无法调用微信支付。继而调用接口，获取到token
        // header["Authorization"]= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    }
    ajaxTimes++;
    // 显示加载中-效果
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    // 定义公共的url
    const baseUrl = "https://api.zbztb.cn/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header:header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            // 不管加载成功还是失败
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });
    })
}