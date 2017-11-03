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

//定义敏感字符
var forbiddenArray =["代孕","法L","法轮功","茉莉花革命","曾庆红","贺!国强","胡锦涛","回!良玉",
"锦涛","毛泽东","王!岐山","温家宝","温家室","习!近平","口交","裸照","肉棒","肉棍","性爱文学","性交","六合彩","六和彩","性病","贱人","装b","大sb","傻逼","傻b","煞逼","煞笔","刹笔","傻比","沙比","婊子养的","我日你","我操","我草","卧艹","卧槽","爆你菊","艹你","cao你","你他妈","真他妈","别他吗","草你吗","草你丫","操你妈","擦你妈","操你娘","操他妈","日你妈","干你妈","干你娘","娘西皮","狗操","狗草","狗杂种",
"狗日的","操你祖宗","操你全家","操你大爷","妈逼","你麻痹","麻痹的","妈了个逼","马勒","狗娘养","贱比","贱b",
"下贱","死全家","全家死光","全家不得好死","全家死绝","白痴","无耻","sb","杀b","你吗b","你妈的","婊子","人渣",
"混蛋","媚外","和弦","兼职","限量","性伴侣","男公关","火辣","精子","射精","诱奸","强奸","做爱","性爱","发生关系",
"按摩","快感","处男","猛男","少妇","屌","屁股","下体","a片","内裤","浑圆","咪咪","发情","刺激","白嫩","粉嫩",
"兽性","风骚","呻吟","sm","阉割","高潮","裸露","不穿","一丝不挂","脱光","干你","干死","我干","爱女人","爱液",
"按摩棒","拔出来","爆草","包二奶","暴干","暴奸","暴乳","爆乳","暴淫","屄","被操","被插","被干","逼奸","仓井空",
"插暴","操逼","操黑","肏你","肏死","操死","操我","厕奴","插比","插b","插逼","插进","插你","插我","插阴","潮吹",
"潮喷","成人电影","成人论坛","成人色情","成人网站","成人文学","成人小说","艳情小说","成人游戏","吃精","赤裸",
"抽插","扌由插","抽一插","春药","大波","大力抽送","大乳","荡妇","荡女","盗撮","多人轮","发浪","放尿","肥逼",
"粉穴","封面女郎","风月大陆","干死你","干穴","肛交","肛门","龟头","裹本","国产av","好嫩","豪乳","黑逼","后庭",
"后穴","虎骑","花花公子","换妻俱乐部","黄片","几吧","鸡吧","鸡巴","鸡奸","寂寞男","寂寞女","妓女","激情",
"集体淫","奸情","叫床","金鳞岂是池中物","金麟岂是池中物","就去日","巨屌","菊花洞","菊门","巨奶","巨乳","菊穴",
"开苞","口爆","口活","口交","口射","口淫","裤袜","狂操","狂插","浪逼","浪妇","浪叫","浪女","狼友","聊性","流淫",
"铃木麻","凌辱","漏乳","露b","乱交","乱伦","轮暴","轮操","轮奸","裸陪","买春","美逼","美少妇","美乳","美腿",
"美穴","美幼","秘唇","迷奸","密穴","蜜穴","蜜液","摸奶","摸胸","母奸","奈美","奶子","男奴","内射","嫩逼","嫩女",
"嫩穴","捏弄","女优","炮友","砲友","喷精","屁眼","品香堂","前凸后翘","强jian","强暴","强奸处女","情趣用品",
"情色","拳交","全裸","群交","惹火身材","人妻","人兽","日逼","日烂","肉棒","肉逼","肉唇","肉洞","肉缝","肉棍",
"肉茎","肉具","揉乳","肉穴","肉欲","乳爆","乳房","乳沟","乳交","乳头","三级片","骚逼","骚比","骚女","骚水",
"骚穴","色逼","色界","色猫","色盟","色情网站","色","色色","色诱","色欲","色b","少年阿宾","少修正",
"射爽","射颜","食精","释欲","兽奸","兽交","手淫","兽欲","熟妇","熟母","熟女","爽片","爽死我了","双臀",
"死逼","丝袜","丝诱","松岛枫","酥痒","汤加丽","套弄","体奸","体位","舔脚","舔阴","调教","偷欢","偷拍",
"推油","脱内裤","文做","我就色","无码","舞女","无修正","吸精","夏川纯","相奸","小逼","校鸡","小穴",
"小xue","写真","性感妖娆","性感诱惑","性虎","性饥渴","性技巧","性交","性奴","性虐","性息","性欲","胸推",
"穴口","学生妹","穴图","亚情","颜射","阳具","杨思敏","要射了","夜勤病栋","一本道","一夜欢","一夜情",
"一ye情","阴部","淫虫","阴唇","淫荡","阴道","淫电影","阴阜","淫妇","淫河","阴核","阴户","淫贱","淫叫",
"淫教师","阴精","淫媚","淫糜","淫魔","淫母","淫女","淫虐","淫情","淫色","淫声浪语","淫兽学园","淫书",
"淫术炼金士","淫水","淫娃","淫威","淫亵","淫样","淫液","淫照","阴b","应召","幼交","幼男","幼女","欲火",
"欲女","玉女心经","玉蒲团","玉乳","欲仙欲死","玉穴","援交","原味内衣","援助交际","张筱雨","招鸡","招妓",
"中年美妇","抓胸","自慰","作爱","18禁","99bb","a4u","a4y","adult","amateur","anal","a片",
"fuck","gay片","g点","g片","hardcore","h动画","h动漫","incest","porn","secom","sexinsex","sm女王",
"xiao77","xing伴侣","tokyohot","yin荡","sb","jj","日你","日死你","日你全家"];
     //定义函数
     function forbiddenStr(str,state){
 //        var destString = trim(str);
         var re = '';
         
         for(var i=0;i<forbiddenArray.length;i++){
              if(i==forbiddenArray.length-1)
                 re+=forbiddenArray[i];
             else
                 re+=forbiddenArray[i]+"|";
         }
         //定义正则表示式对象
         //利用RegExp可以动态生成正则表示式
         var pattern = new RegExp(re,"g");
         if(pattern.test(str)){   
						state=1;
					  //return false;
         }else{				
						state=0;
            //return true;
         }
				 return state;
     }

//图片上传
function addImg(page,sourceType,sizeType,count,navigateFlag,imgsPath,wxbizKey){
      if(count > 0){
          wx.chooseImage({
              count:count,
              sizeType:sizeType,
              sourceType:sourceType,
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
                        // for(var i=0;i<tempFilePaths.length;i++){
                        //     imgsPath.push(tempFilePaths[i])
                        // }
                        // console.log(imgsPath)
                        // if(!navigateFlag){
                        //     page.setData({
                        //         imgsPath:imgsPath,
                        //         btndisabled:false
                        //     })
                        //     if(page.data.theme!=''&&page.data.forminfotxt!=''){
                        //         page.setData({
                        //             btndisabled:false
                        //         })
                        //     }else{
                        //         page.setData({
                        //             btndisabled:true
                        //         })
                        //     }
                        //     wx.hideToast()
                        // }else{
                        //     //如果从首页添加图片后跳转                    
                        //     wx.navigateTo({
                        //         url: '../publicPics/publicPics?imgsPath='+imgsPath,
                        //         complete:function(){
                        //             console.log('跳转finish')
                        //             wx.hideToast()
                        //         }
                        //     })
                        // } 
                      uploadImg(page,imgsPath,count,tempFilePaths,0,navigateFlag,wxbizKey);  
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
  forbiddenStr:forbiddenStr,
  addImg:addImg,
  uploadImg:uploadImg
}
