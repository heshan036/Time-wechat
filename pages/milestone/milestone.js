// pages/milestone/milestone.js
Page({
  data: {
    times:[
      {
        iconUrl:'/assets/imgs/babySmile.png',
        stoneTitle:'出生时的小脚丫'
      },{
        iconUrl: '/assets/imgs/babySmile.png',
        stoneTitle: '第一次笑'
      }, {
        iconUrl: '/assets/imgs/babySmile.png',
        stoneTitle: '第一次哭'
      }, {
        iconUrl: '/assets/imgs/babySmile.png',
        stoneTitle: '宝宝满月'
      }
    ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '里程碑'
    })
  },
  // 跳转到发布中心
  topublicPics: function (e) {
    var stoneTitle = e.currentTarget.dataset.stonetitle;
    var upTypeFlag = '2'
    wx.navigateTo({
      url: '../publicPics/publicPics?stoneTitle=' + stoneTitle + '&upTypeFlag=' + upTypeFlag,
    })
  }
})