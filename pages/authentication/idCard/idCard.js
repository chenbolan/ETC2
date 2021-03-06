//index.js
var COS = require('../../../lib/cos-wx-sdk-v5')
var config = require('../../../utils/uploadfileConfig.js')

var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数

    // 方法一（推荐）服务器提供计算签名的接口
    /*
    wx.request({
        url: 'SIGN_SERVER_URL',
        data: {
            Method: params.Method,
            Key: params.Key
        },
        dataType: 'text',
        success: function (result) {
            callback(result.data);
        }
    });
    */

    // 方法二（适用于前端调试）
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});



//获取应用实例
Page({
  data:{
    imgUrlJson: {
      cardIdFront: '',
      cardIdBack: '',
      carFrontPhoto: '',
      drivingLicenseSignPhoto: '',
      drivingLicenseCodePhoto: '',
    },
    cardIdFront: '',
    cardIdBack: '',
  },
  onLoad() {
    let _this = this;
    wx.getStorage({
      key: 'imgUrlJson',
      success: function (res) {

        let imgUrlJson = JSON.parse(res.data);
        _this.setData({
          imgUrlJson: imgUrlJson
        });
        for (let key in imgUrlJson) {
          switch (key) {
            case 'cardIdFront':
              _this.setData({
                cardIdFront: imgUrlJson[key],
              })
              break;
            case 'cardIdBack':
              _this.setData({
                cardIdBack: imgUrlJson[key],
              })
              break;
          }
        }
      },
    })
  },
  cancel() {
    wx.navigateTo({
      url: '../../cancelReason/cancelReason',
    })
  },
  nextStep(){

    let _this = this;
    if (!this.data.cardIdFront){
      wx.showToast({
        title: '请上传身份证正面照',
      });
      return false;
    }
    if (!this.data.cardIdBack) {
      wx.showToast({
        title: '请上传身份证背面照',
      });
      return false;
    }

    let imgUrlJson = JSON.stringify(_this.data.imgUrlJson);
    wx.setStorage({
      key: 'imgUrlJson',
      data: imgUrlJson,
    });

    wx.navigateTo({
      url: '../carMsg/carMsg',
    })

  },
  simpleUpload(e) {

    let key = e.currentTarget.dataset.key;
    let _this = this;
    // 选择文件
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var filePath = res.tempFilePaths[0]
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名

        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: filePath,
          onProgress: function (info) {
            console.log(JSON.stringify(info));
            wx.showLoading({
              title: '上传中',
            })
          }
        },choseSuccess);
      }
    })


    var imgUrlJson = _this.data.imgUrlJson;


    var choseSuccess = function(err, data) {

      console.log(err || data);
      if (err && err.error) {
        wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
      } else if (err) {
        wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
      } else {
        wx.showToast({ title: '上传成功', icon: 'success', duration: 3000 });
        var imgUrl = data.headers.Location;
        imgUrlJson[key] = imgUrl;
        switch (key){
          case 'cardIdFront':
            _this.setData({
              cardIdFront: imgUrl,
              imgUrlJson: imgUrlJson,
            })
          break;
          case 'cardIdBack':
            _this.setData({
              cardIdBack: imgUrl,
              imgUrlJson: imgUrlJson,
            })
          break;
        }
 
      }
    };

  },
});


