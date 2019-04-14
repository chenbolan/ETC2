//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    state    : 0,
    // amount: 19800,
    amount   : 1,
    orderId  : '',
    payState : '付款完成后为您审核材料',
    wxOrderId:'',
  },
  
  onLoad: function () {
    this.getProcress();
  },
  getPayParams() {

    let _this  = this;
    let url    = '/ws/applyOrder';
    let params = {
      openId : app.globalData.userId,
      amount : this.data.amount,
      orderId: this.data.orderId,
    }

    app.globalData.postHttp(url, params, function (res) {
      console.log(res)
      _this.wxPay(res);
      _this.setData({
        wxOrderId: res.wxOrderId
      })
    });

  },
  /**
   * 支付成功后调取
  */
  paySuccess(){

    let _this  = this;
    let url    = '/ws/changePaying';
    let params = {
      openId   : app.globalData.userId,
      wxOrderId: this.data.wxOrderId,
      orderId  : this.data.orderId,
    }

    let successFn = function (res) {
      _this.getProcress();
    };

    app.globalData.postHttp(url, params, successFn);

  },
 /**
  *  0:资料已提交
  *  1:付款中
  2:资料审核中
  3:资料审核通过
  4:资料审核失败
  5:配送（结束）
  */
  getProcress() {
    let _this  = this;
    let url    = '/etc/queryOrder';
    let params = {
      openId: app.globalData.userId
    }
    app.globalData.postHttp(url, params, function (res) {
      _this.setData({
        orderId: res.orderId,
        state  : res.state
      })
    })
  },
  /**
   * 微信支付接口
  */
  wxPay(payParams) {
    let _this = this;
    wx.requestPayment({
      timeStamp: payParams.timeStamp+'',
      nonceStr : payParams.nonceStr,
      package  : payParams.packageStr,
      signType : payParams.signType,
      paySign  : payParams.paySign,
      success(res) {
        wx.showToast({
          title   : '支付成功',
          icon    : 'none',
          duration: 1000
        });
        
        _this.paySuccess();
      },
      fail(res) {
        wx.showToast({
          title   : '支付失败',
          icon    : 'none',
          duration: 1000
        })
      }
    })
  },
  /**
   * 返回首页
  */
  goIndex(){
    // wx.navigateBack({
    //   delta:100
    // })
  },
  /**
   * 重新申请
  */
  reApply(){
    wx.navigateTo({
      url: '../bid/bid',
    })
  }
})
