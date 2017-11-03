// pages/detail/detail.js
//引入图片预加载组件
const ImgLoader = require('../../assets/img-loader/img-loader.js');
//生成一些测试数据
function genImgListData() {
  let images = [
    'http://img10.360buyimg.com/img/s600x600_jfs/t3586/215/2086933702/144606/c5885c8b/583e2f08N13aa7762.png',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3643/111/394078676/159202/a59f6b72/5809b3ccN41e5e01f.jpg',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3388/167/1949827805/115796/6ad813/583660fbNe5c34eae.jpg',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3163/281/5203602423/192427/db09be58/5865cb7eN808cc6f4.png',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3634/225/410542226/185677/c17f0ecf/5809b073N364fe77e.jpg',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3808/206/329427377/119593/a8cf7470/580df323Nb641ab96.jpg',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3805/133/325945617/116002/e90e0bdf/580df2b5Ncb04c5ac.jpg',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3046/316/3037048447/184004/706c779e/57eb584fN4f8b6502.jpg',
    'http://img10.360buyimg.com/img/s600x600_jfs/t3580/212/1841964843/369414/e78739fb/58351586Ne20ac82a.jpg'
  ]
  // images = images.concat(images.slice(0, 4))
  return images.map(item => {
    return {
      url: item,
      loaded: false
    }
  })
}
Page({
  data: {
    ItemLayout: false,
    picList: genImgListData()
  },
  onLoad:function(options){
    var page=this;
    //初始化图片预加载组件，并指定统一的加载完成回调
    page.imgLoader = new ImgLoader(page, page.imageOnLoad.bind(page))
    //同时发起全部图片的加载
    page.data.picList.forEach(item => {
      page.imgLoader.load(item.url)
    })
    var picList = page.data.picList;
    if (picList.length%3 == 1){
      page.setData({
        ItemLayout:true
      })
    }
  },
  //加载完成后的回调
  imageOnLoad(err, data) {
    console.log('图片加载完成', err, data.src)
    const imgList = this.data.picList.map(item => {
      if (item.url == data.src)
        item.loaded = true
      return item
    })
    this.setData({ picList:imgList })
  }
})