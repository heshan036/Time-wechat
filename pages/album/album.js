//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp();
var basePath=app.globalData.basePath;
var endMonth=0;
var endYear=0;
var timeCount=1;
var timeCurcount=0;
var showfinishFlag=true;//是否显示全部加载完成弹窗
var shareId='';
var userId='';
var isShared='0';
var loadmoreFlag=0;
// 获取时光分页列表
var getList=function(page,shareId,showToastFlag,wxBizKey){
     var getlistNum=3;
      wx.request({
        url: basePath+'/appFree/wxbizTime/getTimeListByMap.do',
        data: {
          wxbizKey:wxBizKey,
          shareId:shareId,
          getNum:getlistNum,
          beginInfoId:endMonth,
          beginyear:endYear
        },
        method: 'GET', 
        header: {
          'content-type': 'application/json'
        }, 
        success: function(res){
          console.log(res.data)
          var List = page.data.timeList;
          timeCount=res.data.timeCount;
          if(showToastFlag == 0){
            page.setData({
              loadingFlag:false
            })
          }
          if(res.data.timeList instanceof Array){
              for(var i = 0; i < res.data.timeList.length; i++){
                  for(var j=0;j<res.data.timeList[i].picList.length;j++){
                      var thumbUrl=res.data.timeList[i].picList[j].thumbUrl.replace(/\\/g,'/');
                      res.data.timeList[i].picList[j].thumbUrl=thumbUrl
                  }                
                  List.push(res.data.timeList[i]);
                  endMonth=res.data.timeList[i].month
                  endYear=res.data.timeList[i].year
                  timeCurcount++
              } 
          } 
          page.setData({
              timeList : List,
              timeCount:timeCount
          })
          loadmoreFlag = 1
        },
        complete:function(){  
          wx.hideToast()   
          page.setData({
              loadingFlag:true
          })
        }
  })
}
Page({
  data: {
    imgPath:app.globalData.imgPath,
    basePath:app.globalData.basePath,
    timeList:[],
    loadingFlag:true,
    timeCount:1
  },
  onHide:function(){
    this.hidebtns()
  },
  onShow:function(){
    var page = this;
    endMonth=0;
    endYear=0;
    timeCount=1;
    timeCurcount=0;
    loadmoreFlag =0;
    showfinishFlag=true;//是否显示全部加载完成弹窗
    page.setData({
      timeList:[]
    })
    wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 3000,
        mask:true
      })
    app.checkInfo(function(){
      try {
        var wxBizKey = wx.getStorageSync('wxBizKey');
        console.log('index.wxBizKey = ' + wxBizKey);
        //获取时光分页列表
          getList(page,shareId,1,wxBizKey)
        // 获得宝宝信息
         getBabyinfo(page,shareId,false,wxBizKey)
      } 
      catch (e) {
      }
    },isShared)
  },
  onReachBottom:function(){
    var page = this;
    if(loadmoreFlag !=0){
        if(timeCurcount<timeCount){
          app.checkInfo(function() {
            try {
              var wxBizKey = wx.getStorageSync('wxBizKey');
              //获取时光分页列表
              getList(page,shareId,0,wxBizKey)
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
                mask:true
              })
          }
          showfinishFlag=false
        }
    }
  },
  onPullDownRefresh:function(){
    var page=this;
    console.log('刷新');
  },
  onLoad: function (options) {
    var page = this;
    // options.userId = 11952;
    //判断是否携带userId，有的话则判断是从分享链接进入
    if(options.userId != '' && options.userId!=undefined){
      shareId= options.userId;
      isShared = '1';
      wx.setStorageSync('shareId',shareId)
    }
    else {
      shareId = wx.getStorageSync('shareId');
    }
    showfinishFlag=true;//是否显示全部加载完成弹窗   
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        var scrollHeight=res.windowHeight
        page.setData({
          scrollHeight:scrollHeight - 164 + 'px'
        })
      }
    })
  },
  // 设置分享
  onShareAppMessage:function(e){
    //app.onShareAppMessage(e)
    var title = '时光·妈妈蜜';
    var path = '/pages/index/index?userId=' + userId + '';
    return {
      title: title,
      path: path,
      success: function(res) {
        console.log(userId);
      }
    }
  },
})