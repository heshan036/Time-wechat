// pages/memories/memories.js
Page({
  data: {
    memories:[
      {
        imgURL:'/assets/imgs/pic1.png',
        title:'里程碑',
        time:''
      },{
        imgURL: '/assets/imgs/pic2.png',
        title: '过去一周美好的回忆',
        time: '2017-06-23-2017-06-30'
      }, {
        imgURL: '/assets/imgs/pic1.png',
        title: '过去一月美好的回忆',
        time: '2017-05-30-2017-06-30'
      }
    ]
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  toPlayimgs:function(e){
    wx.navigateTo({
      url: '',
    })
  }
})