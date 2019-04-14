var app         = getApp();

//这里因为我是本地调试，所以host不规范，实际上应该是你备案的域名信息
// var host     = "http : //2y40b25461.qicp.vip"//预生产
var host        = "https: //2y40b25461.qicp.vip"//预生产
// host         = 'http : //116.213.143.67: 9008/';//服务器
// host         = 'http : //10.23.2.111   : 8092'
// host         = "https: //www.liangshua.com/sptest"//生产
var SuccessCode = "0000";

/**
 * POST请求，
 * URL：接口
 * params：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function postHttp(url, params, doSuccess, doFail) {
    // wx.showLoading({
    //     title: '',
    //     mask:true,
    // })
    wx.request({
        //项目的真正接口，通过字符串拼接方式实现
        url   : host + url,
        header: {
            "content-type": "application/json;charset=UTF-8"
            // "content-type": "multipart/form-data"
            // "content-type": "application/x-www-form-urlencoded"
        },
        data   : params,
        method : 'POST',
        success: function (res) {
          
          if (typeof doSuccess == 'function') {
            successFn(res, doSuccess,doFail)
          };

        },
        fail: function (error) {
          if (typeof doFail == 'function') {
            failFn(error, doFail)
          }
        },
    })
}

//GET请求，不需传参，直接URL调用，
function getHttp(url,params, doSuccess, doFail) {

  var requestUrl = host + url;
    if (params){
        requestUrl = requestUrl + '?';
        for(var item in params){
            requestUrl = requestUrl + item + '=' + params[item] + '&';
        }
    }

    // wx.showLoading({
    //     title: '加载中',
    // });

    wx.request({
        url: requestUrl,
        header: {
            "content-type": "application/json;charset=UTF-8",
            // "content-type": "multipart/form-data"
            // "content-type": "application/x-www-form-urlencoded"
        },
        method : 'GET',
        success: function (res) {
          if (typeof doSuccess == 'function'){
            successFn(res, doSuccess, doFail)
          }
        },
        fail: function (error) {
          if (typeof doFail == 'function'){
            failFn(error, doFail)
          }
        },
    })
}

/**
 * 请求成功执行函数
*/
function successFn(res, doSuccess,doFail){
    //参数值为res.data,直接将返回的数据传入
    var resData = res.data;
    // wx.hideLoading();
    if (resData.retCode == SuccessCode && typeof doSuccess == 'function') {
        doSuccess(resData.data);
        return false;
    };
    if (doFail && typeof doFail == 'function') {
      doFail(resData);
    }else{
      var toastMsg = resData.retMsg ? resData.retMsg : '系统异常';
      wx.showToast({
        title: toastMsg,
        icon: 'none',
        duration: 3000
      });
    }
    
    
}

/**
 * 请求失败执行函数
*/
function failFn(error){
    if (doFail && typeof doFail == 'function') {
        doFail();
    }else{
      wx.showToast({
        title   : '系统异常',
        icon    : 'none',
        duration: 2000
      })
    }
    // wx.hideLoading()
   
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 */
module.exports.postHttp = postHttp;
module.exports.getHttp  = getHttp;
