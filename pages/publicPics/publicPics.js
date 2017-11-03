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
        visiblePicker: ['仅自己可见', '所有人可见','仅亲属可见'],
        isVisible:'所有人可见',
        stonesPicker: ['出生时的小脚丫', '第一次笑', '第一次哭','宝宝满月','无'],
        takeStone: '无',
        stonesDisabled:false,
        loading:false,
        btndisabled:true,
        theme:'',
        upTypeFlag:'0',
        forminfotxt:'',
        themeDisabled:false,
        imgsPath:[],
        videoPath:'',
        videoCtr:false,
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
        var upTypeFlag = options.upTypeFlag
        this.setData({
            date: date,
            curDate:date,
            upTypeFlag:upTypeFlag
        })
        console.log(options)
        //如果从活动列表页进入
        if (options.actName){
            actId=options.actId;
            page.setData({
                themeDisabled:true,
                theme:options.actName
            })
        }
        //如果从里程碑页进入
        if (options.stoneTitle){
          page.setData({
             stonesDisabled: true,
              takeStone: options.stoneTitle
          })
        }
        //如果从首页点击发布成长时光后进入
        if (upTypeFlag == '0' || upTypeFlag == '3'){
            var imgsPath=options.imgsPath;
            var arr=imgsPath.split(",");
            page.setData({
                imgsPath:arr
            })
        } else if (upTypeFlag == '1'){
          page.setData({
            videoPath: options.videoPath
          })
        }

        wx.setNavigationBarTitle({
          title: '时光记录'
        })
    },
    bindDateChange:function(e){
        this.setData({
            date: e.detail.value
        })
    },
    bindStoneChange:function(e) {
      var ind = e.detail.value;
      var stonesPicker = this.data.stonesPicker
      console.log(stonesPicker[ind])
      this.setData({
        takeStone: stonesPicker[ind]
      })
    },
    bindvisibleChange: function (e) {
      var ind = e.detail.value;
      var visiblePicker = this.data.visiblePicker
      this.setData({
        isVisible: visiblePicker[ind]
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
        e.stopPropagation()
    },
    delvideo:function(){
        var page=this;
        page.setData({
          videoPath:'',
          upTypeFlag:'0'
        })
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