// pages/moreBaby/moreBaby.js
Page({
  data: {
    linkBaby:[
      {
        name:'示例',
        headImg:'http://img06.tooopen.com/images/20170313/tooopen_sy_201701533683.jpg',
        age:'1岁2个月',
        record:'160'
      },{
        name: '示例',
        headImg: 'http://img06.tooopen.com/images/20170313/tooopen_sy_201701533683.jpg',
        age:'1岁2个月',
        record:'160'
      }, {
        name: '示例',
        headImg: 'http://img06.tooopen.com/images/20170313/tooopen_sy_201701533683.jpg',
        age: '1岁2个月',
        record: '160'
      }
    ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '宝贝'
    })
  }
})