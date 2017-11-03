var app=getApp();
var basePath=app.globalData.basePath;
var beginInfoId=0;
var actCurcount=0;
var showfinishFlag=true;
//获取活动分页列表
var getActlist=function(page,wxbizKey,showToastFlag){
   // if(showToastFlag){
    //}
    wx.request({
      url: basePath+'/appFree/wxbizTime/getActListByMap.do',
      data: {
          wxbizKey:wxbizKey,
          getNum:5,
          beginInfoId:beginInfoId
      },
      method: 'GET', 
      header: {
          'content-type': 'application/json'
      }, 
      success: function(res){
          var List=page.data.actlist;
          var actCount=res.data.actCount;
          console.log(res.data)
          if(res.data.actCount!=undefined){
            for(var i = 0;i < res.data.actList.length;i++){
                List.push(res.data.actList[i]);
                beginInfoId=res.data.actList[i].id;
                actCurcount++;
            }
            page.setData({
                actlist:List,
                actCount:actCount,
                viewHidden:false
            })
          }else{
              page.setData({
                actCount:0,
                viewHidden:false
            })
          }
      },
      complete:function(){
         wx.hideToast()
      }
    })
}
Page({
    data:{
        imgPath:app.globalData.imgPath,
        basePath:basePath,
        choseId:'',
        btnHeight:48,
        btnDisabled:true,
        actlist:[],
        actCount:1,
        scrollHeight:0,
        scrollTop:0,
        viewHidden:true
    },
    onShow:function(){
      var page=this;
      app.checkInfo(function() {
         try {
           var wxBizKey = wx.getStorageSync('wxBizKey');
           //获取活动分页列表
           getActlist(page,wxBizKey,true)
         } 
         catch (e) {
         }
      })
    },
    onLoad:function(){
        // 获取系统信息
        var page=this;
        beginInfoId=0;
        actCurcount=0;
        showfinishFlag=true;
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 3000,
            mask:true
        })
        wx.getSystemInfo({
            success: function(res) {
                var scrollHeight=res.windowHeight
                page.setData({
                    scrollHeight:scrollHeight - 48
                })
            }
        })
    },
    onReachBottom:function(){
        var page = this;
        console.log(page.data.actCount)
        if(actCurcount<page.data.actCount){
            app.checkInfo(function() {
                try {
                    var wxBizKey = wx.getStorageSync('wxBizKey');
                    //获取活动分页列表
                    getActlist(page,wxBizKey,false)
                } 
                catch (e) {
            }
        })
        }else{
            if(showfinishFlag){
                wx.showToast({
                    title: '已全部加载',
                    icon: 'success',
                    duration: 1000,
                    mast:true
                })
            }
            showfinishFlag=false
        }
    },
    radioChange:function(e){
        var page =this;
        page.setData({
            choseId:e.detail.value,
            btnDisabled:false
        });
    },
    publicAcitivityPics:function(e){
        var pubTypeId=e.currentTarget.dataset.id;
        var choseId=this.data.choseId;
        var list=this.data.actlist;
        var actName='';
        var upTypeFlag='4'
        for(var i=0;i<list.length;i++){
            if(list[i].id==choseId){
                actName=list[i].actName
            }
        }
         wx.navigateTo({
           url: '../publicPics/publicPics?actId=' + choseId + '&actName=' + actName + '&upTypeFlag=' + upTypeFlag,
        })
    },
    navBack:function(e){
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function(res){
            // success
          }
        })
    },
    scanerweima:function(){
        // wx.scanCode({
        //     success: function(res) {
        //         console.log(res)
        //     }
        // })
    }
})