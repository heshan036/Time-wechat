var util = require('../../utils/util.js');
var app = getApp();
var basePath=app.globalData.basePath;
var publicType='';
var themestatus=0;
var infostatus=0;
var actId=''
Page({
    data:{
        takePlace:"不显示",
        date:[],
        curDate:[],
        loading:false,
        btndisabled:true,
        theme:'',
        forminfotxt:'',
        themeDisabled:false,
        imgsPath:[],
        infoDisabled:false,
        infotxtNum:140,
        placeLatitude:0,
        placeLongitude:0
    },
    onShow:function(){
        this.setData({
            btndisabled:true
        })
    },
    onLoad:function(options){
        var date=util.formatTime(new Date()); 
        var page=this;  
        this.setData({
            date: date,
            curDate:date,
        })
        console.log(options)
        //如果从活动列表页进入
        if(options.actName){
            actId=options.actId;
            page.setData({
                themeDisabled:true,
                theme:options.actName
            })
        }
        //如果从首页点击发布成长时光后进入
        if(options.imgsPath){
            var imgsPath=options.imgsPath;
            var arr=imgsPath.split(",");
            page.setData({
                imgsPath:arr
            })
        }
    },
    bindDateChange:function(e){
        this.setData({
            date: e.detail.value
        })
    },
    // 选择发生地点
    chosePlace:function(e){
        var page=this;
        wx.chooseLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: function(res){
            var latitude = res.latitude;
            var longitude = res.longitude;
            var placeName=res.name;
            var placeAddress=res.address;
            page.setData({
                takePlace:placeName,
                placeLatitude:latitude,
                placeLongitude:longitude
            })
          }
       })
    },
    // 添加照片
    addPics:function(){
        var page=this;
        var sourceType=['album', 'camera'];
        var sizeType=['compressed'];
        var count=9-page.data.imgsPath.length;
        var imgsPath=page.data.imgsPath;
        if(count <= 9){
            //util.addImg(page,sourceType,sizeType,count,false,imgsPath) 
            app.checkInfo(function(){
                try {
                    var wxBizKey = wx.getStorageSync('wxBizKey');
                    util.addImg(page,sourceType,sizeType,count,false,imgsPath,wxBizKey) 
                } 
                catch (e) {
                }
            })           
        }else{
            wx.showModal({
                title: '提示',
                content: '最多只可上传9张图片',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }
    },
    // 删除照片
    delImg:function(e){
        var page=this;
        var curId=e.target.dataset.id;
        var imgsPath=page.data.imgsPath;
        var temArray=[];
        for(var i=0;i<imgsPath.length;i++){
            if(i!=curId){
                 temArray.push(imgsPath[i]);
            }
        }
        page.setData({
            imgsPath:temArray
        })
        if(page.data.theme!=''&&page.data.forminfotxt!=''&&page.data.imgsPath.length>0){
            page.setData({
                btndisabled:false
            })
        }else{
            page.setData({
                btndisabled:true
            })
        }
    },
    // 更改主题
    changeName:function(e){
        var page=this;
        page.setData({
            theme:e.detail.value
        })
        if(page.data.theme!=''&&page.data.forminfotxt!=''&&page.data.imgsPath.length>0){
            page.setData({
                btndisabled:false
            })
        }else{
            page.setData({
                btndisabled:true
            })
        }
    },
    // 更改内容
    changeInfotxt:function(e){
        var page=this;
        var forminfotxt=e.detail.value;
        page.setData({
            infotxtNum:140-forminfotxt.length,
            forminfotxt:forminfotxt
        })
        if(page.data.theme!=''&&page.data.forminfotxt!=''&&page.data.imgsPath.length>0){
            page.setData({
                btndisabled:false
            })
        }else{
            page.setData({
                btndisabled:true
            })
        }
        if(forminfotxt.length > 140){
             page.setData({
                infoDisabled:true
            })
        }
    },
    // 标题敏感词汇检测
    themKey:function(e){
        var key=e.detail.value;
        var state=0;
        themestatus=util.forbiddenStr(key,state);
        console.log(themestatus);
        if(infostatus == 1){
            wx.showModal({
                title: '提示',
                content: '不能包含敏感词',
                showCancel:true,
                cancelColor:'#a0a0a0',
                confirmColor:'#52d2af',
                success: function(res) {
                    if (res.confirm) {
                        page.setData({
                            btndisabled:true,
                            theme:''
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    // 内容敏感词汇检测
    infoKey:function(e){
        var page=this
        var key=e.detail.value;
        var state=0;
        infostatus=util.forbiddenStr(key,state);
        console.log(infostatus);
        if(infostatus == 1){
            wx.showModal({
                title: '提示',
                content: '不能包含敏感词',
                showCancel:true,
                cancelColor:'#a0a0a0',
                confirmColor:'#52d2af',
                success: function(res) {
                    if (res.confirm) {
                        page.setData({
                            btndisabled:true,
                            forminfotxt:''
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    // 表单提交
    formSubmit:function(e){
        var page=this;
        var formVal=e.detail.value;
         var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;	
		if(formVal.infotxt.match(regRule)||formVal.theme.match(regRule)) {
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
        page.setData({
            btndisabled:true
        })
        app.checkInfo(function(){
            try {
                var wxBizKey = wx.getStorageSync('wxBizKey');
                publicTime(page,formVal,wxBizKey)
            } 
            catch (e) {
            }
        })
    }
})
// 时光发布
function publicTime(page,formVal,wxbizKey){
    var childrenId=wx.getStorageSync('childrenId');
    console.log(page.data.imgsPath)
    page.setData({
        loading:true
    })
    wx.request({
      url: basePath+'/appFree/wxbizTime/exportAddTimeInfo.do',
      data: {
         wxbizKey:wxbizKey,
         title:formVal.theme,
         actId:actId,
         content:formVal.infotxt,
         picDate:formVal.recordTime,
         address:formVal.takePlace,
         latitude:page.data.placeLatitude,
         longitude:page.data.placeLongitude,
         childrenId:childrenId,
         picUrls:page.data.imgsPath
      },
      method: 'GET', 
      header: {
          'Content-Type':'application/json'
      },
      success: function(res){
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
              if(actId !=''){
                wx.navigateBack({
                    delta: 2, // 回退前 delta(默认为1) 页面
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
              }
             
          }
      },
      complete: function(res) {
          page.setData({
            loading:false,
            btndisabled:false
        })
      }
    })
}