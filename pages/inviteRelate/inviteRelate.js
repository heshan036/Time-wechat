// pages/inviteRelate/inviteRelate.js
Page({
  data: {
    inviteList:['爸爸','爷爷','奶奶','亲友'],
    relateList:[
      {
        role:'妈妈',
        name:'妹陀',
        create:true
      }, {
        role: '爸爸',
        name: '超人超人超人超人',
        create: false
      }, {
        role: '亲友',
        name: '超人',
        create: false
      }
    ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '亲友'
    })
  },
  toInvitedefault:function(e){
    var role=e.currentTarget.dataset.role
    wx.navigateTo({
      url: '../inviteDefault/inviteDefault?role='+role,
    })
  },
  toInviteinfo: function (e) {
    var role = e.currentTarget.dataset.role;
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../inviteInfo/inviteInfo?role=' + role+'&name='+name,
    })
  }
})