//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name        : '',
    idCard      : '',
    mobile      : '',
    carNum      : '',
    adress      : '',
    adressDetail: '',
    openId      : '',
    imgUrlJson  : {},

    region      : ['1','',''],
    customItem  : '全部'
  },
  
  onLoad() {
    let _this = this;
    wx.getStorage({
      key    : 'imgUrlJson',
      success: function (res) {
        
        let imgUrlJson = JSON.parse(res.data);
        _this.setData({
          imgUrlJson: imgUrlJson
        })

      },
    })
  },
  cancel() {
    wx.navigateTo({
      url: '../../cancelReason/cancelReason',
    })
  },
  bindRegionChange(event){
    console.log(event.detail.value);
    let adressData = event.detail.value;
    adressData     = adressData[0] +' '+ adressData[1] +' '+adressData[2]
    this.setData({
      adress: adressData
    })
  },
  toSubOrder(){

    let isPass = this.isPass();
    if(!isPass){
      return false;
    }

    let url    = '/etc/apply';
    let _this  = this;
    let params = {
      openId                 : app.globalData.userId,
      cardIdFront            : this.data.imgUrlJson.cardIdFront,
      cardIdBack             : this.data.imgUrlJson.cardIdBack,
      carFrontPhoto          : this.data.imgUrlJson.carFrontPhoto,
      drivingLicenseSignPhoto: this.data.imgUrlJson.drivingLicenseSignPhoto,
      drivingLicenseCodePhoto: this.data.imgUrlJson.drivingLicenseCodePhoto,
      name                   : this.data.name,
      idCard                 : this.data.idCard,
      carNo                  : this.data.carNum,
      mobile                 : this.data.mobile,
      address                : this.data.adress,
      detailAddress          : this.data.adressDetail,
      agreeSign              : '1',
    }
    app.globalData.postHttp(url,params,function(res){
      _this.toNextSetp(res.orderId);
      wx.setStorage({
        key : "orderId",
        data: res.orderId,
      })
    });
    
  },
  isPass(){

    let isPass    = true;
    let idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;//身份证正则
    let mobileReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/; //手机正则
    let carNumReg = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;

    if (!this.data.name) {
      wx.showToast({
        title   : '请输入姓名',
        icon    : 'none',
        duration: 1000
      })
      isPass = false;
      return false;
    }

    if (!idCardReg.test(this.data.idCard)) {
      wx.showToast({
        title   : '请输入合法身份证',
        icon    : 'none',
        duration: 1000
      })
      isPass = false;
      return false;
    }
    if (!carNumReg.test(this.data.carNum)) {
      wx.showToast({
        title   : '请输入车牌号',
        icon    : 'none',
        duration: 1000
      })
      isPass = false;
      return false;
    }
    if (!mobileReg.test(this.data.mobile)) {
      wx.showToast({
        title   : '请输入合法联系电话',
        icon    : 'none',
        duration: 1000
      })
      isPass = false;
      return false;
    }
    if (!this.data.adress) {
      wx.showToast({
        title   : '请输入收货地址',
        icon    : 'none',
        duration: 1000
      })
      isPass = false;
      return false;
    }
    if (!this.data.adressDetail) {
      wx.showToast({
        title   : '请输入详细地址',
        icon    : 'none',
        duration: 1000
      })
      isPass = false;
      return false;
    }
    return isPass;
  },
  toNextSetp(orderId){
    let url = '../pay/pay?orderId=' + orderId;
    wx.navigateTo({
      url: url,
    })
  },
  getName(e) {

    if (e) {
      this.setData({
        name: e.detail.value
      })
    }

  },
  getIdCard(e) {

    if (e) {
      this.setData({
        idCard: e.detail.value
      })
    }

  },
  getCarNum(e) {

    if (e) {
      this.setData({
        carNum: e.detail.value
      })
    }

  },
  getAdressDetail(e) {

    if (e) {
      this.setData({
        adressDetail: e.detail.value
      })
    }

  }, 
  getAdress(e) {

    if (e) {
      this.setData({
        adress: e.detail.value
      })
    }

  },

  getMobile(e) {

    if (e) {
      this.setData({
        mobile: e.detail.value
      })
    }

  },
})
