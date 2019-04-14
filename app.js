//引入代码
var api = require("./utils/api.js")
App({
  onLaunch: function (options) {

    let teamId             = options.query.teamId ? options.query.teamId: '';
    this.globalData.teamId = teamId;
    this.checkUpdate();
    this.checkSession();


  },
  /**
   * [获取用户信息]
   * @return {[type]} [description]
   */
  getUserInfo() {

    wx.getSetting({
      success: res => {
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo
            console.log(res)
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

  },

  checkSession() {

    let _this = this;

    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效

        wx.getStorage({
          key: 'userId',
          success(res) {

            if (!res.data) {
              _this.weChartLogin()
              return false;
            };

            _this.globalData.userId = res.data;
            if (_this.userIdCallback) {
              _this.userIdCallback(res.data);
            };

          },
          fail() {
            _this.weChartLogin()
          }
        });
        console.log('--userId获取成功onLaunch')

      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        // 登录
        _this.weChartLogin()
      }

    });
    // 由于  是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    // if (_this.userIdCallback) {
    //   _this.userIdCallback(res.userId);
    // }


  },
  /**
   * [微信登录]
   * @return {[type]} [description]
   */
  weChartLogin() {
    
    let _this = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.removeStorage({
          key: 'userId'
        })
        wx.setStorage({ key: 'loginCode', data: res.code });
        _this.globalData.loginCode = res.code;
        _this.getOpenId();
        // _this.getUserInfo();
      }
    })

  },
  /**
   * [获取用户userId]
   * @return {[type]}      [description]
   */
  getOpenId() {

    let _this = this;
    let url = '/ws/queryOpenId';
    let params = {
      code: this.globalData.loginCode,
    };
    this.globalData.postHttp(url, params, function (res) {

      _this.globalData.userId = res.openId;
      wx.setStorage({
        key: "userId",
        data: res.openId
      });
      // _this.isHasAccredit();
      // 由于  是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (_this.userIdCallback) {
        _this.userIdCallback(res.openId);
      }
      console.log('--userId获取成功onLaunch')
    })

  },
  
  checkUpdate() {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            updateManager.applyUpdate()
            return false;
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },
  globalData: {
    userInfo: null,
    userId: '',
    loginCode: '',
    inviterId: '',
    activityFlag: '',
    getHttp: api.getHttp,
    postHttp: api.postHttp,
    advSource: '',
    teamId: "",
  }
})