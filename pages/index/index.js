//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    state  : 0,
    orderId: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let _this = this;
    wx.getStorage({
      key: 'userId',
      success(res) {

        app.globalData.userId = res.data;   
        _this.isHasOrder()
      },
      fail() {
       
      }
    });
    
  },
  onShow(){
    let _this = this;
    wx.getStorage({
      key: 'userId',
      success(res) {

        app.globalData.userId = res.data;
        _this.isHasOrder()
      },
      fail() {

      }
    });
  },
 /**
  *  0:资料已提交
  *  1:付款中
  2:资料审核中
  3:资料审核通过
  4:资料审核失败
  5:配送（结束）
  */
  isHasOrder(userId){
    let _this  = this;
    let url    = '/etc/queryOrder';
    let params = {
      openId:app.globalData.userId
    }
    app.globalData.postHttp(url,params,function(res){
      console.log(res)
      let state   = res.state;
      let orderId = res.orderId;
      if(!state && state != 0) return false;
      _this.setData({
        state:state,
        orderId:orderId
      })

    });
  },
  toBid(){
    if (this.data.state && this.data.state < 5) return false;
    wx.navigateTo({
      url: '../bid/bid',
    })
  },
  toOrder(){
    if (this.data.orderId && this.data.state < 5) {
      let url = '../progress/progress?orderId=' + this.data.orderId;
      wx.navigateTo({
        url: url,
      })
    }
  }
})
