// pages/mainIndex/mainIndex.js
Page({
  data: {
    publichidden: true,
    publicAnimation: {},
    ItemLayout:true,
    itempupHidden:true,
    itempupAnimation:{},
    picList:[
      '../../assets/imgs/pic1.png',
      '../../assets/imgs/pic2.png',
      '../../assets/imgs/pic2.png'
    ]
  },
  onShow:function(options){
    
  },
  // 显示弹窗
  showbtns: function (e) {
    var page = this;
    var childrenId = wx.getStorageSync('childrenId')
    // if (childrenId == '' || childrenId == undefined || childrenId == null) {
    //   wx.showModal({
    //     title: '无宝宝信息',
    //     content: '没有宝宝，不能发表成长信息哦！',
    //     showCancel: true,
    //     cancelColor: '#a0a0a0',
    //     confirmColor: '#52d2af',
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '../babyCenter/babyCenter'
    //         })
    //       }
    //     }
    //   })
    //   return
    // }
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    animation.scale(1).step()
    page.setData({
      publichidden: false,
      publicAnimation: animation.export()
    })
  },
  // 隐藏弹窗
  hidebtns: function (e) {
    var page = this;
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    animation.scale(0).step()
    page.setData({
      publichidden: true,
      publicAnimation: animation.export()
    })
  },
  itempupToggle:function(e){//每一项删除、编辑弹窗显示及隐藏
    var page=this;
    var itempupHidden = page.data.itempupHidden;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    if (itempupHidden){
      animation.scale(1).opacity(1).step();
      page.setData({
        itempupHidden: false,
      })
    }else{
      animation.scale(0).opacity(0).step();
      page.setData({
        itempupHidden: true,
      })
    }
    page.setData({
      itempupAnimation: animation.export()
    })
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  toMemories: function (e) {
    wx.navigateTo({
      url: '../memories/memories',
    })
  }
})