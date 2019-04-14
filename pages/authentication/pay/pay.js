//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    amount: 1,
    orderId:'',
    wxOrderId:'',
  },
  
  onLoad: function (options) {
    // this.isHasOrder();
    this.setData({
      orderId:options.orderId
    })
  },
  /**
 * 支付成功后调取
*/
  paySuccess() {

    let _this = this;
    let url = '/ws/changePaying';
    let params = {
      openId: app.globalData.userId,
      wxOrderId: this.data.wxOrderId,
      orderId: this.data.orderId,
    }

    let successFn = function (res) {
      wx.navigateTo({
        url: '../../progress/progress',
      });
    };

    app.globalData.postHttp(url, params, successFn);

  },
  /**
   * 微信支付接口
  */
  wxPay(payParams) {
    let _this = this;
    wx.requestPayment({
      timeStamp: payParams.timeStamp + '',
      nonceStr: payParams.nonceStr,
      package: payParams.packageStr,
      signType: payParams.signType,
      paySign: payParams.paySign,
      success(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'none',
          duration: 1000
        });

        _this.paySuccess();
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  getPayParams() {

    let _this = this;
    let url = '/ws/applyOrder';
    let params = {
      openId: app.globalData.userId,
      amount: this.data.amount,
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
  
})
