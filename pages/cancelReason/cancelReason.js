//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeEq: 0,
    orderId : '',
    delRes  : ["修改身份信息", "修改车辆信息","已办理过ETC"],
  },

  onLoad: function () {
    wx.getStorage({
      key: 'orderId',
      success(res) {

        _this.setData({
          orderId:res.data
        });

      },
      fail() {

      }
    });
    
  },
  cancel(){
    if (!this.data.orderId){
      this.goIndex();
      return false;
    }
    let _this  = this;
    let delMsg = '';
    let key    = this.data.activeEq - 1;
    if(key > -1){
      delMsg = this.data.delRes[key]
    }
    let url    = '/etc/cancelOrder';
    let params = {
      openId : app.globalData.userId,
      delMsg : delMsg,
      orderId: this.data.orderId,
      // orderId: '0ed3f34ef0f44ee99a9881f2eeef9d05',
    }

    app.globalData.postHttp(url, params, function (res) {
      _this.goIndex();
    });
  },
  continue(){
    wx.navigateBack({
      delta: 1
    })
  },
  checked(e){
    console.log(e)
    let eq = e.currentTarget.dataset.eq;
    if (eq == this.data.activeEq && this.data.activeEq>0){
      this.setData({
        activeEq:0
      })
    }else{
      this.setData({
        activeEq: eq
      })
    }
  },
  /**
 * 返回首页
*/
  goIndex() {
    // wx.navigateBack({
    //   delta:100
    // })
  },
})
