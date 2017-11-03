// pages/inviteDefault/inviteDefault.js
Page({
  data: {
    role:'',
    children:'李俊'
  },
  onLoad: function (options) {
      var page=this;
      page.setData({
        role:options.role
      })
  },
})