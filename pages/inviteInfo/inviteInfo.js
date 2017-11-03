// pages/inviteInfo/inviteInfo.js
Page({
  data: {
    name:'',
    role:'',
    authorityArray:['是','否'],
    defaultIndex:0
  },
  onLoad: function (options) {
    var page=this;
    page.setData({
      name:options.name,
      role:options.role
    })
  },
  bindAuthorityChange:function(e){
    this.setData({
      defaultIndex: e.detail.value
    })
  },
  editName:function(e){
    
  }
})