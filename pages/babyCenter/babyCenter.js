var app=getApp();
var util = require('../../utils/util.js');
var basePath=app.globalData.basePath;
var keyStatus='';
var childrenId=wx.getStorageSync('childrenId');
var headUrlFlag=false;
// 宝贝编辑页面
 var editbabyInfo=function(page,wxbizKey){
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 1800
          })
        wx.request({
          url: basePath+'/appFree/wxbizTime/getBabyInfoPage.do',
          data: {
              babyId:childrenId,
              wxbizKey:wxbizKey
          },
          method: 'GET', 
          header: {
              'content-type': 'application/json'
          }, 
          success: function(res){
            var babyInfo=res.data.babyInfo;
            if(babyInfo!=undefined){
                childrenId=babyInfo.id;
                 wx.setStorageSync('childrenId',childrenId);
                 page.setData({
                    nickname:babyInfo.nickName,
                    headUrl:babyInfo.headUrl,
                    date:babyInfo.birthdayString
                })
                if(babyInfo.sex == 11){
                    page.setData({
                        items: [
                            {name: '10', value: '男'},
                            {name: '11', value: '女', checked: 'true'}
                        ]
                    })
                }
            }          
            wx.hideToast()
          },
          fail: function() {
            console.log('宝贝编辑页面初始fail')
          }
        })
    }
var submitbabyInfo=function(page,wxbizKey,babyInfo){
    var headUrl='';
    if(headUrlFlag){
        headUrl=page.data.headUrl
    }
    wx.request({
        url: basePath+'/appFree/wxbizTime/exportUpdateBabyInfo.do',
        data: {
            wxbizKey:wxbizKey,
            babyId:childrenId,
            nickName:babyInfo.nickname,
            headUrl:headUrl,
            birthdayString:babyInfo.birthday,
            sex:babyInfo.gender
        },
        method: 'GET', 
        header: {
            'content-type': 'application/json'
        }, 
        success: function(res){
        console.log(res);
        var content=res.data.message    
        if(res.data.statusCode !=1000){
            wx.showModal({
                title: '提示',
                content: content,
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }else{
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
              success: function(res){
                // success
              },
              fail: function(res) {
                // fail
              },
              complete: function(res) {
                // complete
              }
            })
            // wx.redirectTo({
            //     url: '../index/index'
            // })
        }
        }
    })
}
Page({
    data:{
        date:[],
        curDate:[],
        loading:false,
        btndisabled:true,
        basePath:app.globalData.basePath,
        imgPath:app.globalData.imgPath,
        headUrl:'',
        nickname:'',
        relation:'妈妈',
        items: [
            {name: '10', value: '男', checked: 'true'},
            {name: '11', value: '女'}
        ]
    },
    onLoad:function(options){
        childrenId=wx.getStorageSync('childrenId');
        var date=util.formatTime(new Date()); 
        var page=this;
        headUrlFlag=false;
        page.setData({
            date: date,
            curDate:date,
        })
        app.checkInfo(function() {
            try {
                var wxBizKey = wx.getStorageSync('wxBizKey');
                editbabyInfo(page,wxBizKey)
            } 
            catch (e) {
            }
        })   

        wx.setNavigationBarTitle({
          title: '宝贝'
        }) 
    },
    bindDateChange:function(e){
        this.setData({
            btndisabled:false,
            date: e.detail.value
        })
    },
    uploadPortrait:function(e){
        var page=this;
        app.checkInfo(function() {
            try {
                var wxBizKey = wx.getStorageSync('wxBizKey');
                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: 'compressed', // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) {
                            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                            var tempFilePaths = res.tempFilePaths
                            wx.uploadFile({
                                url: basePath+'/ajaxUpload/wxzibuploadImg.do', //仅为示例，非真实的接口地址
                                filePath: tempFilePaths[0],
                                name: 'headUrl',
                                header: {
                                    'Content-Type':'application/json'
                                }, 
                                formData:{
                                    wxbizKey:wxBizKey
                                },
                                success: function(res){
                                    console.log(res.data)
                                    page.setData({
                                        headUrl:JSON.parse(res.data).thumbUrl,
                                        btndisabled:false
                                    })
                                    headUrlFlag=true
                                }
                            })
                        }
                    })
            } 
            catch (e) {
            }
        })
    },
    // 宝贝信息提交
    formSubmit:function(e){
        console.log(e.detail.value)
        var page=this;
        var babyInfo=e.detail.value;
        var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;	
		if(babyInfo.nickname.match(regRule)) {
		    wx.showModal({
                title: '提示',
                content: '不支持表情!',
                success: function(res) {
                    page.setData({
                        btndisabled:true
                    })
                }
                })
			return;
		}
         app.checkInfo(function() {
                try {
                    var wxBizKey = wx.getStorageSync('wxBizKey');
                    submitbabyInfo(page,wxBizKey,babyInfo)
                } 
                catch (e) {
                }
            })

    },
    // 敏感词汇检测
    nicknameKey:function(e){
        var page=this;
        var key=e.detail.value;
        var state=0;
        keyStatus=util.forbiddenStr(key,state);
        if(keyStatus == 1){
            wx.showModal({
                title: '提示',
                content: '宝宝姓名不能包含敏感词',
                showCancel:true,
                cancelColor:'#a0a0a0',
                confirmColor:'#52d2af',
                success: function(res) {
                    if (res.confirm) {
                        page.setData({
                            btndisabled:true,
                            nickname:''
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    nicknameInput:function(e){
        var page=this;
        var nickname=e.detail.value;
         page.setData({
            nickname:nickname
        })
        if(nickname.length>0){
            page.setData({
                btndisabled:false,
            })
        }else{
            page.setData({
                btndisabled:true,
            })
        }
    },
    radioChange:function(e){
        this.setData({
            btndisabled:false
        })
    }
})
