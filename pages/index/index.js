// pages/mainIndex/mainIndex.js
var util = require('../../utils/util.js');
var app = getApp();
var basePath = app.globalData.basePath;
function GetList(page){
 
}
Page({
  data: {
    scrollHeight:0,
    publicHidden: true,
    publicAnimation: {},
    pubcloseAnimation:{},
    ItemLayout:true,
    headerBg:'http://img06.tooopen.com/images/20170313/tooopen_sy_201701533683.jpg',
    timeList:[
      {
        id:'time1',
        title:'橘子洲一日游',
        year:'17',
        date:'07-01',
        time:'18:25',
        age: '4岁5个月',
        intro: '适用于微信小程序的图片预加载组件，已应用于京东购物小程序版。使用步骤如下：',
        person:'粑粑',
        itempupHidden: true,
        picFlag:true,
        picList: ['../../assets/imgs/pic1.png', '../../assets/imgs/pic1.png', '../../assets/imgs/pic1.png'        ]
      },{
        id: 'time2',
        title: '橘子洲一日游',
        year: '17',
        date: '07-01',
        time: '18:25',
        age: '4岁5个月',
        intro: '适用于微信小程序的图片预加载组件，已应用于京东购物小程序版。使用步骤如下：',
        person: '粑粑',
        itempupHidden: true,
        picFlag:false,
        picList: ['../../assets/imgs/pic2.png']
      }
    ],
  },
  onLoad: function () {
    // 这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var page = this;
    //获得窗口高度
    wx.getSystemInfo({
      success: function(res) {
        page.setData({
          scrollHeight: res.windowHeight
        })
      },
    })
  },
  onShow: function () {
    //在页面展示之后先获取一次数据
    var page = this;
    GetList(page);
    //获取每个时光故事的offsetTop
    const timeArray = page.data.timeList;
    const query = wx.createSelectorQuery();
    wx.createSelectorQuery().selectAll('.timeItem').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        let idx = rect.dataset.idx;
        timeArray[idx].offsetTop = rect.top;
      })
    }).exec()
  },
  onHide:function(){
    // 页面关闭是关闭发布弹窗
    this.setData({
      publicHidden: false
    })
    this.publicTime()
  },
  loadList: function () {
    //该方法绑定了页面滑动到底部的事件
    var page = this;
    GetList(page);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  //页面滑动事件
  onPageScroll: function (e) {
    var page=this;
    var scrollTop = e.scrollTop;
    var timeArray = page.data.timeList;
    for (var i = 0; i < timeArray.length;i++){
      let offsetTop = timeArray[i].offsetTop
      if (offsetTop < scrollTop + page.data.scrollHeight){
        timeArray[i].picFlag=true
      }
    }
    page.setData({
      timeList: timeArray
    })
  },
  // 隐藏或显示发布弹窗
  publicTime: function (e) {
    var page = this;
    var publicHidden = page.data.publicHidden;
    if (publicHidden) { // 显示发布弹窗
        page.setData({
          publicHidden: false
        })
        var btnsAnimation = wx.createAnimation({
          duration: 600,
          timingFunction: 'ease',
        })
        var closeAnimation = wx.createAnimation({
          delay: 400,
          duration: 400,
          timingFunction: 'linear',
        })
        btnsAnimation.bottom(0).step();
        closeAnimation.opacity(1).step()  
    } else {// 隐藏发布弹窗
        var btnsAnimation = wx.createAnimation({
          duration: 400,
          delay: 200,
          timingFunction: 'ease',
        })
        var closeAnimation = wx.createAnimation({
          duration: 200,
          timingFunction: 'linear',
        })
        btnsAnimation.bottom(-334).step()
        closeAnimation.opacity(0).step()
        setTimeout(function(){
          page.setData({
            publicHidden: true
          })
        },600)
    }
    page.setData({
      publicAnimation: btnsAnimation.export(),
      pubcloseAnimation: closeAnimation.export()     
    })
  },
  //每一个时光故事的删除、编辑弹窗显示及隐藏
  itempupToggle:function(e){
    var page=this;
    var idx = e.currentTarget.dataset.idx;
    var newArray = page.data.timeList;
    newArray[idx].itempupHidden = !newArray[idx].itempupHidden;
    page.setData({
      timeList: newArray,
    })
  },
  changeCover:function(){
    var page=this;
    wx.showModal({
      title: '提示',
      content: '确认更换时光封面？',
      showCancel: true,
      cancelColor: '#a0a0a0',
      confirmColor: '#52d2af',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            success: function(res) {
              var tempFilePaths = res.tempFilePaths
              page.setData({
                headerBg:tempFilePaths[0]
              })
            },
          })
        }
      }
    })
  },
  // 发布照片
  upPhotos:function(e){
      var page=this;
      var count=9;
      var imgsPath = [];
      var upTypeFlag='0'
      util.addImg(page, count, true, imgsPath, upTypeFlag) 
  },
  // 发布视频
  upVideo:function(e){
      var page=this;
      var imgsPath = [];
      var upTypeFlag = '1'
      util.addVideo(page, true, imgsPath, upTypeFlag) 
  },
  // 跳转到详情页
  toDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  // 跳转到回忆故事
  toMemories: function (e) {
    wx.navigateTo({
      url: '../memories/memories',
    })
  },
  // 跳转到云相册
  toAlbum:function(e){
    wx.navigateTo({
      url: '../album/album',
    })
  },
  // 跳转到里程碑
  topMilestone:function(){
    wx.navigateTo({
      url: '../milestone/milestone',
    })
  },
  // 跳转到宝贝中心
  toBabycenter:function(){
    wx.navigateTo({
      url: '../babyCenter/babyCenter',
    })
  },
  // 跳转到活动秀
  toActivity:function(){
    wx.navigateTo({
      url: '../acitivityList/acitivityList',
    })
  },
  toMorebaby:function(){
    wx.navigateTo({
      url: '../moreBaby/moreBaby',
    })
  },
  toInviterelate: function () {
    wx.navigateTo({
      url: '../inviteRelate/inviteRelate',
    })
  },
  // 跳转到发布中心
  topublicPics:function(){
    var page = this;
    var count = 9;
    var imgsPath = [];
    var upTypeFlag = '3'
    util.addImg(page, count, true, imgsPath, upTypeFlag) 
  }
})