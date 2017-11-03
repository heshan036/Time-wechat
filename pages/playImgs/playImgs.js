// pages/playImgs/playImgs.js
var playCategory='';
Page({
  data: {
    category:'0',
    playState:true,
    maskBg:'/assets/imgs/videoBg3.png',
    audiosrc: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    circular:true,
    autoplay:true,
    interval:3000,
    duration:800,
    imgUrls:[
        {
          url: 'http://img10.360buyimg.com/img/s600x600_jfs/t3586/215/2086933702/144606/c5885c8b/583e2f08N13aa7762.png',
          txt:'预加载'
        },{
          url: 'http://img10.360buyimg.com/img/s600x600_jfs/t3643/111/394078676/159202/a59f6b72/5809b3ccN41e5e01f.jpg',
          txt: ''
        },{
          url: 'http://img10.360buyimg.com/img/s600x600_jfs/t3388/167/1949827805/115796/6ad813/583660fbNe5c34eae.jpg',
          txt: 'onload方法回调预载完成事件'
        }, {
          url: 'http://img10.360buyimg.com/img/s600x600_jfs/t3643/111/394078676/159202/a59f6b72/5809b3ccN41e5e01f.jpg',
          txt: ''
        }, {
          url: 'http://img10.360buyimg.com/img/s600x600_jfs/t3388/167/1949827805/115796/6ad813/583660fbNe5c34eae.jpg',
          txt: 'onload方法回调预载完成事件'
        }
      ]
  },
  onLoad: function (options) {
    var page = this;
    var imgArr = page.data.imgUrls;
    playCategory = options.category;
    if (options.category == '1'){
      page.setData({
        maskBg: '/assets/imgs/videoBg1.png'
      })
    } else if (options.category == '2'){
      page.setData({
        maskBg: '/assets/imgs/videoBg2.png'
      })
    }else{
      page.setData({
        maskBg: '/assets/imgs/videoBg3.png'
      })
    }
    //控制图片懒加载，第2张图片之后暂不显示
    for (var i = 0; i < imgArr.length; i++) {
      var imgItem = imgArr[i];
      if (i < 3) {
        imgItem.show = true;
      } else {
        imgItem.show = false;
      }
      imgArr[i] = imgItem;
    }
    page.setData({
      imgUrls: imgArr,
      category: options.category
    })

    wx.setNavigationBarTitle({
      title: '回忆故事'
    })
  },
  onShow: function (e) {
    var page=this;
    var sumPage = page.data.imgUrls.length;//计算图片总张数
    var currentPage = 1;
    var progressValue = Math.floor(currentPage * 100 / sumPage);//计算进度条的值
    page.setData({
      progressValue: progressValue//设置进度条的值
    })
    page.audioCtx = wx.createAudioContext('myAudio');//创建音频对象
    page.audioCtx.play();
  },
  swiperChange: function (e) {
    var page=this;
    var imgArr = page.data.imgUrls;
    var sumPage = imgArr.length;
    var currentPage = e.detail.current ;
    var progressValue = Math.floor((currentPage+1) * 100 /sumPage);
    page.setData({
      progressValue: progressValue //在图片切换的时候设置进度条的值
    })
    //控制图片懒加载，当前图片后的2张显示
    for (var i = 0; i < imgArr.length; i++) {
      if ( i < currentPage + 2) {
        if (imgArr[i].show == false) {
          imgArr[i].show = true;
        }
      }
    }
    page.setData({
      imgUrls: imgArr
    })
    //当播放到最后一张图片是，轮播和音乐停止
    if(currentPage + 1 == sumPage){
      setTimeout(function(){
        page.setData({
          autoplay: false,
          playState: false
        })
      },800)
    }
  },
  control:function(){//控制图片切换和音频播放
    var page=this;
    if (page.data.playState){
      page.setData({
        autoplay: false,
        playState:false
      })
      page.audioCtx.pause()
    }else{
      page.setData({
        autoplay: true,
        playState: true
      })
      page.audioCtx.play()
    }
  }
})