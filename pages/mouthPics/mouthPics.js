var app = getApp();
var basePath=app.globalData.basePath;
var shareId=wx.getStorageSync('shareId');
var childrenId=wx.getStorageSync('childrenId');
var chooseValue='';
var beginInfoId=0;
var handleCurrent;
var month='';
var year='';
var dateCount=0;
var dateCurcount=0;
var showfinishFlag=true;
var swiperList=[];
var swiperCurnum=0
// 相册分页列表
var getmonthList=function(page,wxbizKey,showToastFlag,beginInfoId){
    console.log(shareId)
    wx.request({
      url: basePath+'/appFree/wxbizTime/getpicListByMap.do',
      data: {
          wxbizKey:wxbizKey,
          shareId:shareId,
          childrenId:childrenId,
          beginyear:year,
          month:month,
          beginInfoId:beginInfoId
      },
      method: 'GET', 
      header: {
          'content-type': 'application/json'
      }, 
      success: function(res){
        console.log(res.data)
        var dateList=page.data.dateList;
        dateCount=page.data.dateCount;
        if(res.data.dateList instanceof Array){
            for(var i = 0; i < res.data.dateList.length; i++){
                for(var j=0;j<res.data.dateList[i].picList.length;j++){
                    var thumbUrl=res.data.dateList[i].picList[j].thumbUrl.replace(/\\/g,'/');
                    res.data.dateList[i].picList[j].thumbUrl=thumbUrl
                } 
                dateList.push(res.data.dateList[i]);
                beginInfoId=res.data.dateList[i].day;
                month=res.data.dateList[i].month;
                year=res.data.dateList[i].year;
                dateCurcount++
            }
        }
        if(res.data.dateCount==0){
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
              success: function(res){
                // success
              }
            })
        }
        page.setData({
            dateList : dateList,
            editFlag:res.data.editFlag
        })

      },
      complete:function(){
         wx.hideToast()
      }
    })
};
// 图片详情查看
var showpicInfo=function(page,picId,wxbizKey,swiperFlag){
    wx.request({
      url: basePath+'/appFree/wxbizTime/getPicInfo.do',
      data: {
        wxbizKey:wxbizKey,
        shareId:shareId,
        childrenId:childrenId,
        picId:picId,
        year:year,
        month:month,
        picNum:2
      },
      method: 'GET',
      header: {'content-type': 'application/json'}, 
      success: function(res){
        var picList=res.data.picList;
        swiperCurnum=res.data.rownum;
        if(res.data.picList instanceof Array){
            for(var i=0;i<res.data.picList.length;i++){
                var picUrl=res.data.picList[i].picUrl.replace(/\\/g,'/');
                res.data.picList[i].picUrl=picUrl
            }
        }
        swiperList=picList 
        if(!swiperFlag){//点击查看详情
            if(swiperCurnum == 1){
                page.setData({
                    itemCurrent:0
                })
            }else if(swiperCurnum == 2){
                page.setData({
                    itemCurrent:1
                })
            }else{
                page.setData({
                    itemCurrent:2
                })
            }
            page.setData({
                swiperItems:swiperList
            })
        }else{//滑动切换详情
            if(swiperCurnum > 2){
                page.setData({
                    duration:-800
                }) 
                setTimeout(function(){
                    page.setData({
                        itemCurrent:2,
                        duration:200,
                        swiperItems:swiperList
                    })
                    
                },180)
            }          
        }          
      }
    })
}
//图片删除
var delPic=function(page,picId,wxbizKey){
     wx.request({
        url: basePath+'/appFree/wxbizTime/deletePic.do',
        data: {
            wxbizKey:wxbizKey,
            picId:picId
        },
        method: 'GET', 
        header: {
            'content-type': 'application/json'
        }, 
        success: function(res){
            console.log(res)
            wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000,
                mast:true
            })
        },
        complete:function(){
            page.setData({
                editTxt:'编辑',
                checkboxdisabled:true,
                btnloading:false,
                pupHidden:true,
                btndisabled:true,
                itemchecked:false,
                btnHeight:0,
                currentGesture: 0,
                itemCurrent:1,
                duration:200,
                swiperItems:[],
                dateList:[],
                editFlag:11
            })
            app.checkInfo(function() {
                try {
                    var wxBizKey = wx.getStorageSync('wxBizKey');
                    var beginInfoId=0;
                    //获取时光分页列表
                    getmonthList(page,wxBizKey,true,beginInfoId)
                } 
                catch (e) {
                }
            })
        }
    })
}
Page({
    data:{
        editTxt:'编辑',
        basePath:app.globalData.basePath,
        imgPath:app.globalData.imgPath,
        checkboxdisabled:true,
        btnloading:false,
        pupHidden:true,
        btndisabled:true,
        itemchecked:false,
        btnHeight:0,
        currentGesture: 0,
        itemCurrent:1,
        duration:200,
        swiperItems:[],
        dateList:[],
        editFlag:11
    },
    onLoad:function(options){
        var page=this;
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 3000,
            mask:true
        })
        shareId=wx.getStorageSync('shareId');
        childrenId=wx.getStorageSync('childrenId');
        year=options.year;
        month=options.month;
        chooseValue='';
        beginInfoId=0;
        showfinishFlag=true;
        app.checkInfo(function() {
            try {
                var wxBizKey = wx.getStorageSync('wxBizKey');
                //获取时光分页列表
                getmonthList(page,wxBizKey,true,beginInfoId)
            } 
            catch (e) {
            }
        })
    },
    onReachBottom:function(){
        var page = this;
        if(dateCurcount<dateCount){
            app.checkInfo(function() {
                try {
                    var wxBizKey = wx.getStorageSync('wxBizKey');
                   //获取相册分页列表
                     getmonthList(page,wxBizKey,false,beginInfoId)
                } 
                catch (e) {
                }
            })
         }else{
              if(showfinishFlag){
                wx.showToast({
                    title: '已全部加载',
                    icon: 'success',
                    duration: 1000,
                    mast:true
                })
            }
            showfinishFlag=false
        }
    },
    // 编辑相册
    editPics:function(){
        var page=this;
        page.setData({
            checkboxdisabled:false,
            editTxt:'取消',
            btnHeight:48
        })
    },
    // 取消编辑相册
    concelEditPics:function(){
        var page=this;
        page.setData({
            checkboxdisabled:true,
            editTxt:'编辑',
            itemchecked:false,
            btnHeight:0
        })
    },
    // 选择相片，当选择项大于0时，删除按钮可用,否则disabled
    checkboxChange:function(e){
        var page=this;
        chooseValue=e.detail.value;
        if(chooseValue.length > 0){
            page.setData({
                btndisabled:false,
            })
        }else{
            page.setData({
                btndisabled:true
            })
        }
    },
    // 删除照片
    delmouthPics:function(){
        var page=this;
        var picId=chooseValue.join(",");
        wx.showModal({
            title: '删除提示',
            content: '您确定要删除选中的照片？',
            showCancel:true,
            cancelColor:'#a0a0a0',
            confirmColor:'#52d2af',
            success: function(res) {
                console.log(picId)
                if (res.confirm) {
                    page.setData({
                        btnloading:true,
                        btndisabled:true
                    })
                    app.checkInfo(function() {
                        try {
                            var wxBizKey = wx.getStorageSync('wxBizKey');
                        //获取相册分页列表
                            delPic(page,picId,wxBizKey)
                        } 
                        catch (e) {
                        }
                    })
                }
            }
        })      
    },
    // 关闭照片浏览弹窗
    hidePup:function(){
        var page=this;
        page.setData({
            pupHidden:true,
            swiperItems:[]
        })
        swiperList=[]
        console.log(page.data.swiperItems)
    },
    // 显示照片浏览弹窗
    showPup:function(e){
        var page=this;
        var picId=e.target.dataset.id;
        app.checkInfo(function(){
            try {
                var wxBizKey = wx.getStorageSync('wxBizKey');
                 showpicInfo(page,picId,wxBizKey,false);                
            } 
            catch (e) {
            }
        })
        page.setData({
            pupHidden:false
        })
    },
    // 照片详情切换
    changeHandle:function(e){
        handleCurrent=e.detail.current
    },
    // 滑动结束更换swiper元素
    changeItem:function(e){
        var page=this;     
        if(handleCurrent != page.data.itemCurrent && handleCurrent != undefined){
            var picId=page.data.swiperItems[handleCurrent].id;
            app.checkInfo(function(){
                try {
                    var wxBizKey = wx.getStorageSync('wxBizKey');
                    showpicInfo(page,picId,wxBizKey,true)
                } 
                catch (e) {
                }
            })                
        }
    },
  // 设置分享
  onShareAppMessage:function(e){
    var title = '时光·妈妈蜜';
    var path = '/pages/index/index?userId=' + shareId + '&sharemouthPicsFlag=1';
    return {
      title: title,
      path: path,
      success: function(res) {
        console.log(shareId);
      }
    }
  },
})