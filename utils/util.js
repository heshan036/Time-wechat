// 时间格式化
var app = getApp();
var basePath=app.globalData.basePath;

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  //return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
   * offetHeight  滚动计算部分到顶部距离
   * scrollTop   滚动高度
   * height      每个模块的高度
   * colunm      列数
  **/

function countIndex(offetHight, scrollTop, height, colunm) {
  // 单例获取屏幕宽度比
  if (!countIndex.pix) {
    try {
      let res = wx.getSystemInfoSync()
      countIndex.pix = res.windowWidth / 375
    } catch (e) {
      countIndex.pix = 1
    }
  }
  let scroll = scrollTop - offetHight * countIndex.pix
  let hei = height * countIndex.pix
  return scroll > 0 ? Math.floor(scroll / hei) * colunm : 0
}

//视频上传
function addVideo(page, navigateFlag, imgsPath, upTypeFlag){
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: 'back',
    success: function (res) {
      var tempFilePath = res.tempFilePath;
      var height = res.height;
      var size = res.size;
      var duration = res.duration;
      wx.showToast({
        title: '上传视频中...',
        icon: 'loading',
        duration: 100000,
        mask: true
      })
      if (!navigateFlag) {
        page.setData({
          imgsPath: imgsPath,
          btndisabled: false
        })
        if (page.data.theme != '' && page.data.forminfotxt != '') {
          page.setData({
            btndisabled: false
          })
        } else {
          page.setData({
            btndisabled: true
          })
        }
        wx.hideToast()
      }else {
        //上传视频后是否跳转
        wx.navigateTo({
          url: '../publicPics/publicPics?videoPath=' + tempFilePath + '&upTypeFlag=' + upTypeFlag,
          complete: function () {
            console.log('跳转finish')
            wx.hideToast()
          }
        })
      }
    }
  })
}

//图片上传
function addImg(page, count, navigateFlag, imgsPath, upTypeFlag){
      if(count > 0){
          wx.chooseImage({
              count:count,
              sizeType: ['compressed'],
              sourceType:['album', 'camera'],
              success:function(res){
                  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                  var tempFilePaths = res.tempFilePaths;             
                  if( tempFilePaths.length > 0 ){
                        wx.showToast({
                            title: '上传图片中...',
                            icon: 'loading',
                            duration:100000,
                            mask:true
                        })
                        for(var i=0;i<tempFilePaths.length;i++){
                            imgsPath.push(tempFilePaths[i])
                        }
                        console.log(imgsPath)
                        if(!navigateFlag){
                            page.setData({
                                imgsPath:imgsPath,
                                btndisabled:false
                            })
                            wx.hideToast()
                        }else{
                            //上传图片后是否跳转                   
                            wx.navigateTo({
                              url: '../publicPics/publicPics?imgsPath=' + imgsPath + '&upTypeFlag=' + upTypeFlag,
                                complete:function(){
                                    console.log('跳转finish')
                                    wx.hideToast()
                                }
                            })
                        }  
                  }
              }
          })
        }else{
            wx.showModal({
                title: '提示',
                content: '最多只能上传9张照片',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
            })
        }
    }

//图片递归调用
function uploadImg(page,imgsPath,count,file,i,navigateFlag,wxbizKey) {
    wx.uploadFile({
        url: basePath+'/ajaxUpload/wxzibuploadImg.do', //上传文件接口
        method:"POST",
        header: {
            'Content-Type':'application/json'
        }, 
        formData:{
           wxbizKey:wxbizKey
        },
        filePath:  file[i],
        name: 'file',
        success: function (res) {
             imgsPath.push(basePath+JSON.parse(res.data).picUrl);
             if(!((i+1)==file.length)){
                 uploadImg(page,imgsPath,count,file,i+1,navigateFlag,wxbizKey);
              }else{
                 //app.globalData.imgPath=imgPath;
                 count = count - i;
                 if(!navigateFlag){
                    page.setData({
                        imgsPath:imgsPath,
                        btndisabled:false
                    })
                    if(page.data.theme!=''&&page.data.forminfotxt!=''){
                        page.setData({
                            btndisabled:false
                        })
                    }else{
                        page.setData({
                            btndisabled:true
                        })
                    }
                    wx.hideToast()
                 }else{
                    //如果从首页添加图片后跳转                    
                    wx.navigateTo({
                        url: '../publicPics/publicPics?imgsPath='+imgsPath,
                        complete:function(){
                            console.log('跳转finish')
                            wx.hideToast()
                        }
                    })
                 }               
              }
        }
      })
}


module.exports = {
  formatTime: formatTime,
  countIndex:countIndex,
  addImg:addImg,
  uploadImg:uploadImg,
  addVideo: addVideo
}
