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
};
// 获取宝贝信息
var  getBabyinfo =function(page,shareId,swithBaby,wxBizKey){
        wx.request({
          url: basePath+'/appFree/wxbizTime/getBabyInfo.do',
          data: {
            wxbizKey:wxBizKey,
            shareId:shareId
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          }, 
          success: function(res){
            var babyInfo=res.data.babyInfo;
            console.log(babyInfo)
            if(babyInfo=={} || babyInfo==undefined){
                wx.showModal({
                  title: '无宝宝信息',
                  content: '赶快添加宝宝，记录宝宝成长时光',
                  showCancel:false,
                  cancelColor:'#a0a0a0',
                  confirmColor:'#52d2af',
                  success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                          url: '../babyCenter/babyCenter',
                          complete:function(){
                               wx.hideToast()
                          }
                      })
                    }
                  }
                })
              }else{
                  page.setData({
                      babyInfo:babyInfo,
                      babyFlag:babyInfo.babyFlag,
                      picFlag:babyInfo.picFlag,
                      updateFlag:babyInfo.updateFlag                    
                  })
                  setTimeout(function(){
                    page.setData({
                        babyheadUrl:babyInfo.headUrl
                    })
                  },400)
                  console.log(babyInfo.userId)
                  wx.setStorageSync('shareId', babyInfo.userId)
                  wx.setStorageSync('childrenId', babyInfo.id)
                  userId=babyInfo.userId                 
              }             
          },
          fail: function(){
            console.log('获取宝贝信息fail')
          },
          complete:function(){
              // if(swithBaby){
              //     wx.showToast({
              //       title: '已切换到自己的宝宝',
              //       icon: 'success',
              //       duration: 5000,
              //       mask:true
              //     })
              // }
          }
    })
  }
Page({
  data: {
    imgPath:app.globalData.imgPath,
    basePath:app.globalData.basePath,
    switchBabyDisabled:false,
    getUerinfo:false,
    publichidden:true,
    publicAnimation:{},
    babyInfo:{},
    timeList:[],
    loadingFlag:true,
    babyFlag:10,
    updateFlag:11,
    picFlag:11,
    timeCount:1,
    babyheadUrl:''
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
      timeList:[],
      babyInfo:{}
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
  // 显示弹窗
  showbtns:function(e){
    var page=this;
    var childrenId=wx.getStorageSync('childrenId')
    if( childrenId == '' || childrenId==undefined|| childrenId == null){
        wx.showModal({
           title: '无宝宝信息',
            content: '没有宝宝，不能发表成长信息哦！',
            showCancel:true,
            cancelColor:'#a0a0a0',
            confirmColor:'#52d2af',
            success: function(res) {
              if (res.confirm) {
                  wx.navigateTo({
                      url: '../babyCenter/babyCenter'
                  })
              }
            }
        })
        return
    }
    var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
    })
    page.animation = animation
    animation.scale(1).step()
    page.setData({
      publichidden:false,
      publicAnimation:animation.export()
    })
  },
  // 隐藏弹窗
  hidebtns:function(e){
    var page=this;
    var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
    })
    page.animation = animation
    animation.scale(0).step()
    page.setData({
      publichidden:true,
      publicAnimation:animation.export()
    })
  },
  // 发布成长时光
  showPublic:function(e){
    var page=this;
    var pubTypeId=e.currentTarget.dataset.id;
    page.hidebtns();
    var childrenId=wx.getStorageSync('childrenId')
    if( childrenId == '' || childrenId==undefined|| childrenId==null){
        wx.showModal({
           title: '无宝宝信息',
            content: '没有宝宝，不能发表成长信息哦！',
            showCancel:true,
            cancelColor:'#a0a0a0',
            confirmColor:'#52d2af',
            success: function(res) {
              if (res.confirm) {
                  wx.navigateTo({
                      url: '../babyCenter/babyCenter'
                  })
              }
            }
        })
        return
    }
    wx.showActionSheet({
        itemList: ['拍照', '从相册中选择'],
        success: function(res) {
          var tapIndex=res.tapIndex;
          var sourceType=['camera','album'];
          var sizeType=['compressed'];
          var count=9;
          var imgsPath=[];
          if(tapIndex > -1){
              sourceType=sourceType[tapIndex].split(",")
              console.log(sourceType)
              //util.addImg(page,sourceType,sizeType,count,true,imgsPath) 
              app.checkInfo(function(){
                  try {
                      var wxBizKey = wx.getStorageSync('wxBizKey');
                        util.addImg(page,sourceType,sizeType,count,true,imgsPath,wxBizKey) 
                  } 
                  catch (e) {
                  }
              })            
          }
        }
    })   
  },
  // 发布活动秀
  showActivity:function(e){
    wx.navigateTo({
      url: '../acitivityList/acitivityList',
      success: function(res){
        // success
      }
    })
    this.hidebtns()
  },
  showDetails:function(e){
    var month=e.target.dataset.month;
    var year=e.target.dataset.year;
    wx.navigateTo({
      url: '../mouthPics/mouthPics?month='+month+'&&year='+year
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
  // 编辑宝宝信息
  editPortrait:function(e){
    var page=this;
    wx.navigateTo({
      url: '../babyCenter/babyCenter',
    })
  },
  // 切换宝宝
  switchBaby:function(){
      var page=this;
      timeCurcount=0;
      timeCount=1;
      shareId= '';
      endMonth=0;
      endYear=0;
      showfinishFlag=true;//是否显示全部加载完成弹窗
      page.setData({
        timeList:[],
        babyFlag:10,
        updateFlag:11,
        picFlag:11,
        babyInfo:{},
        babyheadUrl:'',
        timeCount:1
      })
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 3000,
        mask:true
      })
      wx.clearStorageSync('isShare');
      app.checkInfo(function(){
        try {
          var wxBizKey = wx.getStorageSync('wxBizKey');
          // console.log('index.wxBizKey = ' + wxBizKey);
          //获取时光分页列表
          if(timeCurcount<timeCount){
            getList(page,shareId,1,wxBizKey)
          }
          // 获得宝宝信息
          getBabyinfo(page,shareId,true,wxBizKey)
        } 
        catch (e) {
        }
      })
  }
})
