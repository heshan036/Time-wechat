//app.js
var SESSION_API_URL = "https://develop.mmmee.cn/LingMeng/appFree/wxbizTime/authorize.do";
var LOGIN_API_URL = "https://develop.mmmee.cn/LingMeng/appFree/wxbizTime/authorize.do";
var UPLOADIMG_URL="https://develop.mmmee.cn/LingMeng/appFree/wxbizTime/uploadImg.do";
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    //清除分享标识
    wx.clearStorageSync('isShare');
    wx.clearStorageSync('shareId');
    wx.clearStorageSync('userId');
    wx.clearStorageSync('childrenId');
  },
  checkInfo:function(cb,isShare){
      var that = this;
      var authorizationFlag = "1"; //0 用户已经取消授权，1是用户确认授权
      var wxBizFlag = ""; //0 需要登录；1是不需要登录
      var wxBizKey = "";

      try {
        wxBizKey = wx.getStorageSync('wxBizKey');
        if(!wxBizKey || wxBizKey=="undefined") {
          wxBizKey = "";
        }
        //console.log('wxBizKey = ' + wxBizKey);

        if(isShare &&  isShare!="undefined") {//有值就保存，否则不处理
          wx.setStorageSync('isShare',isShare);
        }
        // else {
        //   wx.setStorageSync('isShare','0');
        // }
      } 
      catch (e) {
      }

      wx.request({
        url: SESSION_API_URL,
        data: {
          wxbizKey:wxBizKey
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json'
        }, // 设置请求的 header
        success: function (res) {
          try {
            // console.log('statusCode = ' + res.data.statusCode);
            
            wx.setStorageSync('wxBizKey', res.data.wxbizKey);
            //console.log('wx.request = ' + res.data.wxbizKey);
            if(res.data.wxbizFlag=="2") {//如果服务端没有记录，则需要登录
              login(res.data.wxbizKey,cb);
            }
            else {
              // console.log('res.data.wxbizFlag = ' + res.data.wxbizFlag);
              if(res.data.statusCode!="1000") {//出现异常
                 goForBidUserPage();
              }
              else {
                typeof cb == "function" && cb();
              }
            }
          } 
          catch (e) {    
          }
        },
        fail: function () {
          // console.log('fail');
        }
      })
    },
  globalData:{
    userInfo:null,
    basePath:'https://develop.mmmee.cn/LingMeng',
    imgPath:'https://develop.mmmee.cn/LingMeng/resources/timeimg',
  },
  onShareAppMessage:function(e){
    var userId=wx.getStorageSync('userId')
    return {
      title: '时光·妈妈蜜',
      path:'/page/user?userId='+userId+'',
      success: function(res) {
        // console.log(title)
      }
    }
  }
})

function login(wxBizKey,cb) {
   var that = this;
    wx.login({
        success: function (res) {
            // console.log('wx.request.code = ' + res.code);
            if(res.code) {
                var code = res.code;
                wx.getUserInfo({
                    success: function (res2) {              
                       setSeesionKey(cb,wxBizKey,code,res2.encryptedData,res2.iv);
					             wx.setStorageSync('authorizationFlag', "1");//用户同意授权
                    },
                    fail: function () {
					             wx.setStorageSync('authorizationFlag', "2");//用户拒绝授权
                       console.log('微信获取授权拒绝');
                      
                      var isShare = wx.getStorageSync('isShare');//分享标识
                      console.log('isShare='+isShare);

                       if(!isShare || isShare=="undefined" || isShare=="0") {//非分享过来的，继续访问
                          goNoAuthorizePage();
                       }
                       else {//分享过来的，继续访问
                          typeof cb == "function" && cb();
                       }
                    }
                })      
            }
        },
        fail: function () {
          // console.log('wx.login.fail');
        }
    })
}

function setSeesionKey(cb,wxBizKey,code,encryptedData,iv) {
    // console.log('wx.setSeesionKey');
    wx.request({
        url: LOGIN_API_URL,
        data: {
            wxbizKey:wxBizKey,
            code:code,
            encryptedData:encryptedData,
            iv:iv
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            'content-type': 'application/json'
        }, // 设置请求的 header
        success: function (res) {
            // success
            // console.log('wx.setSeesionKey.success');
            //wx.hideToast();
            //console.log('服务器返回=='+res.statusCode);
            if(res.data.statusCode!="1000") {//出现异常
                goForBidUserPage();
            }
            else {
                typeof cb == "function" && cb();
            }
        },
        fail: function () {
            //  console.log('wx.setSeesionKey.fail');
            // fail
            //wx.hideToast();
        },
        complete: function () {
            //console.log('wx.setSeesionKey.complete');
            // complete
        }
    })
}

function goForBidUserPage() {
  // wx.redirectTo({
  //   url: '/pages/forbidUser/forbidUser'
  // })
  return;
}

function goNoAuthorizePage() {
  // wx.redirectTo({
  //   url: '/pages/noAuthorize/noAuthorize'
  // })
  return;
}