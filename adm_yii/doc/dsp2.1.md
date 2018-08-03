# dsp2.1接口说明

## 时段定向
- 保存计划
    - /promotion/adplansave 
    - 请求数据增加字段hour_target,代表周一到周日每一天的时段安排,1-7代表周一到周日，0-23代表小时
   {1:[8,9,10],2:[8],3:[8],4:[8],5:[8],6:[8],7:[8]}
   

## 创意联动
- 计划下新建创意时，获取可用的样式、模板、尺寸等 
    - GET /adplan/creativeFormats?id=(计划id)
    - 返回的数据结构：
    
    
   ```javascript
 formats=[
     {  name:'样式名称',
         slot_class:'样式uid',
         child:[
             {
                 template:'模板uid',
                 template_name:'模板名称',
                 "pic_setting":{
                     "format":["jpg","jpeg","png","gif"] ,
                     "size":{"text":"100kb","bytes":102400},
                     "scale":["16_9"],
                     "count":1,//1：单独 3：组图
                 },
                 "title_setting":{"max":"23","min":6},
                 "description_setting":{"max":"23","min":6},
                 "video_setting":{
                     "format":["mp4"],"size":{"text":"5m","bytes":5242880},"scale":["16:9","4:3"]
                  }
             }
         ]
     },
     {  name:'',
              slot_class:'',
              child:[]
          }
 ]
```

- 创意的建议尺寸 根据模板id获取
    - GET /adcreative/recommendSize?template=7c44a357-ecd0-4c5b-80d0-db8bd5100149
    - response: 
    ```javascript
      response = {
          "msg": "",
          "data": {
              "2_1": ["600*300", "640*320"],
              "16_9": ["720*405"],
              "4_3": ["800*600"],
              "3_2": ["960*640"]
          },
          "status": 1
      };
    ```

- 保存创意时  material 结构上增加图片尺寸、大小信息
    - 图片大小
        - pic_bytes:单图图片的字节数 eg.10240 [10kb]
        - pic1_bytes:组图图1的字节数
        - pic2_bytes：组图图2的字节数
        - pic3_bytes：组图图3的字节数
    - 图片尺寸
        - pic_size:'320_210'
    - example:
 ```javascript
$data=[{
            "name": "大图模板M7FKCR",
            "group_id": "30",
            "plan_id": "54",
            "link": "http://xlx.test",
            "template_class": "c0bb62fe-fc21-4b0b-a5c7-d547db667032",
            "material": {
                "pic": "c0ffeb5a-6cf8-47a5-9310-5db8256c1cbc.png",
                "pic_scale": "109_25",
                "pic_bytes":10240,//新增
                "pic_size":"320_210"//新增
            },
            "landing": "",
            "monitoring_url": "",
            "ad_source": "xlx-test",
            "extend_type": "empty",
            "extend_data": {}
        }]; 
```

    
- 批量增加创意
        - 默认支持

##批量操作

### 广告组
- 批量暂停、启用、删除、修改日预算
    - POST /adgroup/batchUpdate
    - {type:'status',ids:[12,13],status:'active'}  status:active/pause/delete
    - {type:'budget',ids:[12,13],budget:200}
    - $.ajax({url:'/adgroup/batchUpdate',type:'post',data:{type:'budget',ids:[12,13,14,15],budget:300}}).then(function(r){console.log(r)},function(e){console.error(e)})

- 单个修改广告组名称、日预算
    - /adgroup/update
    - {type:'name','id':12,name:''}
    - $.ajax({url:'/adgroup/update',type:'post',data:{type:'name','id':12,name:'a'}}).then(function(r){console.log(r)},function(e){console.error(e)})

- 批量复制 
    - POST /adgroup/batchCopy 
    - body: {gid:[5,6],recurse:0/1}
    - gid:广告组id
    - recurse:1递归 0只复制广告组本身
    
### 计划
- 获取所有的计划 将原有接口中的参数group_id=填空即可
    - /promotion/adplanlist?search=&order=desc&limit=50&offset=0&begin=2017-11-21&end=2017-11-21&status=&group_id=    
- 筛选维度增加推广目的、出价方式
    - purpose 取值（landing,download）
    - bid_type 取值（cpm,cpc）
- 增加列表页展示信息 
    - 组名称 group_name
    - 推广目的 purpose
    - 出价方式 bid_type 
- 添加计划时获取所有广告组结构
    - /adgroup/groups?plan=0&search=关键字&purpose= 
    - plan取值0：没有plan信息 1：带有计划信息
    - purpose取值：'':所有，landing：落地页,download:下载
- 批量修改 启用、暂停、删除、日预算、出价、添加关键词
    - POST /adplan/batchUpdate
    - {type:'status',ids:[12,13],status:'active'}  status:active/pause/delete
    - {type:'budget',ids:[12,13],budget:200}
    - {type:'price',ids:[12,13],price:200}
    - {type:'word',
    plans:[
        plan_id:[{ "word": "汽车", "target_type": "1", "match_type": "1" },...],
        plan_id2:[ { "word": "二手汽车", "target_type": "1", "match_type": "1" }]
        ]
    }
    
- 单一修改：计划名称、出价、日预算
    - post /adplan/update
    - {type:'name','id':12,name:''}
    - {type:'price','id':12,price:''}
    - {type:'budget','id':12,budget:''}
    
- 批量复制计划
    - POST /adplan/batchCopy 
    - body: {pid:[3,4],gid:[5,6],recurse:0/1}
    - pid:计划id 
    - gid:广告组id
    - recurse:1递归 0只复制计划本身

### 创意
- 创意列表的接口返回数据中增加一个字段标识该创意是否有匹配的广告可以投放 usable:0(不可用)1(可用）
- 创意是否可用查询接口
    - adcreative/creativeUsable?ids=2,3,4,45
    - response:{"msg":"","data":{"2":1,"3":0,"4":1,"45":1},"status":1}
- 查询接口增加信息：标题、描述、图片缩略图(均属于物料，在material字段上)、url(link字段)、组、计划   
    - /promotion/adcreativelist?search=&order=desc&limit=50&offset=0&begin=2017-11-22&end=2017-11-22&status=&
    - 响应示例
    
    ```javascript
    var d={
            "rows": [{
                "goup_id": "52",
                "goup_name": "落地页-固定信息流",
                "plan_id": "121",
                "plan_name": "固定信息流",
                "id": "341",
                "name": "落地页－固定信息流－大图文字",
                "status": "pause",
                "audit_status": "audit",
                "code": "<!DOCTYPE html>\r\n<html lang=\"en\" style=\"margin: 0;padding: 0;width: 100%\">\r\n<head>\r\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no\"/>\r\n    <title>动态信息流-大图+文字模板</title>\r\n</head>\r\n<body style=\"width:100%;margin: 0;padding: 0;\">\r\n<div id=\"deepleaper_dynamicAD\" class=\"deepleaper_dynamicAD\" style=\"overflow: hidden;\">\r\n    <div id=\"linkElement\" style=\"overflow: hidden\">\r\n        <p style=\"margin: 0;\r\n            padding: 5px 0 3.5px;\r\n            color: [:TITLECOLOR:];\r\n            font-size: [:TITLEFONTSIZE:]px;\r\n            line-height: [:TITLEFONTSIZE:]px;\r\n            font-family: '[:TITLEFONTFAMILY:]', 'SimHei', 'Microsoft YaHei', 'SimHei', 'SimSun', sans-serif;\r\n            text-align: left\">但撒发生大幅撒旦</p>\r\n        <img src=\"http://static.adm.deepleaper.com/material/b2faa1f8-994c-401c-8fd5-baa1c7374bc7.jpg\" style=\"width:100%;display: block\"\r\n             id=\"templatePic\">\r\n        <p id=\"deepleaper-detail\" style=\"margin: 0;\r\n            padding: 3.5px 0 0;\r\n            color: [:DESCOLOR:];\r\n            font-size: [:DESFONTSIZE:]px;\r\n            line-height: [:DESFONTSIZE:]px;\r\n            font-family: '[:DESFONTFAMILY:]', 'SimHei', 'Microsoft YaHei', 'SimHei', 'SimSun', sans-serif;\r\n            text-align: left\"></p>\r\n    </div>\r\n    <div style=\"height: 42px;margin-top: 3.5px;width: 100%;background-color: #f0f4f3;display: none\"\r\n         id=\"dl_extend_creative\">\r\n        <span style=\"height: 42px;line-height:42px;font-size: 13px;margin-left: 7px;color: #5d5d5d;\"></span>\r\n        <a id=\"deepleaper_extend_creative_phone\" href=\"javascript:void(0)\"><span style=\"font-size: 13px;padding: 3px 10px;border: 1px solid #1f96d8;color: #1f96d8;-webkit-border-radius: 3px;\r\n    -moz-border-radius: 3px;border-radius: 3px;float: right;position: relative;top: 8px;right: 7px;\" id=\"dl_extend_btn\"></span></a>\r\n    </div>\r\n    <div class=\"deepleaper-ad-bottom\" style=\"margin: 3.5px 0 5px;height: 14px\">\r\n        <span class=\"deepleaper-advertising\" style=\"font-size: 12px;\r\n            line-height: 12px;\r\n            padding: 1px 2px;\r\n            position: relative;\r\n            top: -1px;\r\n            vertical-align: top;\r\n            border: 1px solid #949494;\r\n            color: #949494;\r\n            -webkit-border-radius: 3px;\r\n            -moz-border-radius: 3px;\r\n            border-radius: 3px;\r\n            display: inline-block;\r\n            margin: 0;\r\n            float: left;\">广告</span>\r\n        <span style=\"font-size: 12px;\r\n            line-height: 12px;\r\n            color: #949494;\r\n            padding: 2px 2px 2px 5px;\r\n            position: relative;\r\n            top: -1px;\r\n            vertical-align: top;\r\n            border: none;\r\n            display: inline-block;    max-width: 200px;\r\n    overflow: hidden;\">123123</span>\r\n        <img src=\"http://static.adm.deepleaper.com/material/closeAd.png\" id=\"deepleaper-closeAd\"\r\n             class=\"deepleaper-closeAd\"\r\n             style=\"display: inline-block;\r\n                    float: right;\r\n                    border:none;\r\n                    border-radius: 0;\r\n                    margin: 0 0 0 2px;\r\n                    width: 14px;\r\n                    height: 14px;\">\r\n    </div>\r\n    <script>\r\n        var dpscale = \"[:SCALE:]\";\r\n        var dpscaleArry = dpscale.split(\"_\");\r\n        if (window.innerWidth !== 0) {\r\n            bodyW = window.innerWidth;\r\n        } else {\r\n            bodyW = window.screen.width;\r\n        }\r\n        var daH = bodyW * dpscaleArry[1] / dpscaleArry[0];\r\n        var pic = document.getElementById(\"templatePic\");\r\n        pic.style.height = daH + 'px';\r\n\r\n        var des = \"\";\r\n        if (des == '') {\r\n            var desElement = document.getElementById('deepleaper-detail');\r\n            desElement.style.paddingTop = 0;\r\n            var dl_extend_creative_element = document.getElementById('dl_extend_creative');\r\n            dl_extend_creative_element.style.marginTop = 0;\r\n        }\r\n        //判断平台类型\r\n        var dl_template_system = 'web';\r\n        var isAndroid = '';\r\n        var isIos = '';\r\n\r\n        try {\r\n            isAndroid = droidNative.nativeFeedType();\r\n        } catch (e) {\r\n            isAndroid = '';\r\n        }\r\n\r\n        try {\r\n            nativeGetSystem('get');\r\n            isIos = 'ios';\r\n        } catch (e) {\r\n            isIos = '';\r\n        }\r\n\r\n        if (isAndroid == 'Android') {\r\n            dl_template_system = 'android';\r\n        } else if (isIos == 'ios') {\r\n            dl_template_system = 'ios';\r\n        } else {\r\n            dl_template_system = 'web';\r\n        }\r\n        //进入落地页\r\n        var linkElement = document.getElementById(\"linkElement\");\r\n        linkElement.addEventListener('click', function () {\r\n            switch (dl_template_system) {\r\n                case 'android':\r\n                    try {\r\n                        droidNative.nativeAndroidClick();\r\n                    } catch (e) {\r\n                    }\r\n                    break;\r\n                case 'ios':\r\n                    window.location.href = 'dp-' + 'http://test.deepleaper.com/promotion/adcreativefixedaddview?planId=121&groupId=52&entrance=group';\r\n                    break;\r\n                default:\r\n                    var clk = '[:CLK:]';\r\n                    var request = new XMLHttpRequest();\r\n                    request.open('get', clk, true);\r\n                    request.withCredentials = \"true\";\r\n                    request.send();\r\n                    var landing = '[:LANDING:]';\r\n                    var img = new Image();\r\n                    img.src = landing;\r\n                    window.location.href = 'http://test.deepleaper.com/promotion/adcreativefixedaddview?planId=121&groupId=52&entrance=group';\r\n            }\r\n        });\r\n        //关闭广告\r\n        var close = document.getElementById(\"deepleaper-closeAd\");\r\n        close.addEventListener('click', function () {\r\n            switch (dl_template_system) {\r\n                case 'android':\r\n                    try {\r\n                        droidNative.nativeFeedClose('close');\r\n                    } catch (e) {\r\n                    }\r\n                    break;\r\n                case 'ios':\r\n                    try {\r\n                        nativeFeedClose('close');\r\n                    } catch (e) {\r\n                    }\r\n                    break;\r\n                default:\r\n                    var deepleaper_dynamicAD = document.getElementById(\"deepleaper_dynamicAD\");\r\n                    var deepleaper_dynamicAD_parentNode = deepleaper_dynamicAD.parentNode;\r\n                    deepleaper_dynamicAD_parentNode.parentNode.removeChild(deepleaper_dynamicAD_parentNode);\r\n            }\r\n        });\r\n        //附加创意逻辑\r\n        var extend_type = \"empty\";\r\n        var phone_number = \"\";\r\n        var extend_url = \"\";\r\n        if (extend_type == 'phone') {\r\n            document.getElementById('dl_extend_creative').style.display = 'block';\r\n        } else if (extend_type == 'form') {\r\n            document.getElementById('dl_extend_creative').style.display = 'block';\r\n        } else if (extend_type == 'download') {\r\n            document.getElementById('dl_extend_creative').style.display = 'block';\r\n        } else {\r\n            document.getElementById('dl_extend_creative').style.display = 'none';\r\n        }\r\n        //针对平台的模板处理\r\n        switch (dl_template_system) {\r\n            case 'android':\r\n                break;\r\n            case 'ios':\r\n                break;\r\n            default:\r\n                if (extend_type == 'phone') {//web下的拨打电话使用html处理，js跳转在手机QQ上失效\r\n                    document.getElementById('deepleaper_extend_creative_phone').setAttribute('href', 'tel:' + phone_number);\r\n                }\r\n        }\r\n        //附加创意按钮点击逻辑\r\n        var dl_extend_btn = document.getElementById(\"dl_extend_btn\");\r\n        dl_extend_btn.addEventListener('click', function () {\r\n            switch (dl_template_system) {\r\n                case 'android':\r\n                    if (extend_type == 'phone') {\r\n                        try {\r\n                            droidNative.nativeCall(phone_number);\r\n                        } catch (e) {\r\n                        }\r\n                    } else if (extend_type == 'form') {\r\n                        try {\r\n                            droidNative.nativeForm(extend_url);\r\n                        } catch (e) {\r\n                        }\r\n                    } else if (extend_type == 'download') {\r\n                        try {\r\n                            droidNative.nativeDownload(extend_url);\r\n                        } catch (e) {\r\n                        }\r\n                    }\r\n\r\n                    break;\r\n                case 'ios':\r\n                    if (extend_type == 'phone') {\r\n                        try {\r\n                            nativeCall(phone_number);\r\n                        } catch (e) {\r\n                        }\r\n                    } else if (extend_type == 'form') {\r\n                        try {\r\n                            nativeForm(extend_url);\r\n                        } catch (e) {\r\n                        }\r\n                    } else if (extend_type == 'download') {\r\n                        try {\r\n                            nativeDownload(extend_url);\r\n                        } catch (e) {\r\n                        }\r\n                    }\r\n                    break;\r\n                default:\r\n                    var EXTEND_URL_CLK = '[:EXTEND_URL_CLK:]';\r\n                    var request = new XMLHttpRequest();\r\n                    request.open('get', EXTEND_URL_CLK, true);\r\n                    request.withCredentials = \"true\";\r\n                    request.send();\r\n                    if (extend_type == 'phone') {\r\n                    } else if (extend_type == 'form') {\r\n                        window.location = extend_url;\r\n                    } else if (extend_type == 'download') {\r\n                        window.location = extend_url;\r\n                    }\r\n            }\r\n        });\r\n    </script>\r\n</div>\r\n</body>\r\n</html>",
                "ad_source": "123123",
                "extend_type": "empty",
                "extend_data": [],
                "material": {
                    "pic": "b2faa1f8-994c-401c-8fd5-baa1c7374bc7.jpg",
                    "pic_scale": "2_1",
                    "title": "但撒发生大幅撒旦",
                    "description": ""
                },
               "link": "http://b.link.com",
                "imp": null,
                "clk": null,
                "ctr": null,
                "spend_budget": null,
                "comment": "",
                "audit_others": []
            }],
            "total": "1",
            "group_id": "52",
            "group_name": "落地页-固定信息流",
            "plan_id": "121",
            "plan_name": "固定信息流"
        }
	
    ```
    
- 批量操作：  暂停、启用、删除(status)、修改标题/描述(material) url(落地页url、第三方曝光url、第三方点击url)  
    - POST /adcreative/batchUpdate
    - {type:'status',ids:[12,13],status:'active'}  status:active/pause/delete
    - {type:'material',ids:[12,13],material:{title:标题,description:描述}}
    - {type:'url',ids:[12,13],url:{'link':url1,'monitoring_url':url3,'landing':url2}}
- 批量复制广告创意 
    - POST /adcreative/batchCopy 
    - body: {pid:[3,4],cid:[5,6]}
    - pid:计划id 
    - cid：创意id
    
- 单一操作：创意名称 标题 url
    - post /adcreative/update
    - {type:'name','id':12,name:''}
    - {type:'material','id':12,material:{title:标题}}
    - {type:'url',ids:12,url:{'link':url1}}
- 显示组、计划树形结构、计划搜索
    - /adgroup/groups?plan=1&search=关键字 -- 0：没有plan信息 1：带有计划信息
    - 响应示例
    ```javascript
      resp=[{
                "group_id": "32",
                "group_name": "测试广告-1-2",
                "purpose": "landing",
                "group_status":"active",//pause
                "child": [{
                    "plan_id": "72",
                    "plan_name": "测试广告计划-1-2",
                    "plan_status":"active",//pause

                }]
      	    }
    	]
    ```
    
## 定向复用、关键词导入导出
   
### 定向复用
- 根据计划查询定向 /promotion/fetchadplan?id=121
  
### 关键词导入导出
   
- 根据计划导出关键词 
- /adplan/downloadWord?plan_id=16&target_type=1
- target_type（1：正向关键词 2:否定关键词）
- 错误响应示例：
```javascript
r={
    "msg":"invalid parameter:pid=,targetType=",
    "data":null,
    "status":0
}
```

### 查询计划的关键词
- /adplan/keywords?ids=1,3,146target_type=1
- target_type（0:不限 1：正向关键词 2:否定关键词）
- resp
    ```javascript
        resp={
        "msg":"",
        "data":{
            "1":[{"plan_id":"1","word_id":"1","target_type":"2","match_type":"2","word":"1"}],
            "3":[{"plan_id":"3","word_id":"1","target_type":"1","match_type":"1","word":"1"},{"plan_id":"3","word_id":"2","target_type":"2","match_type":"1","word":"2"}],
            "146":[]
        },
        "status":1
        }
    ```

## 数据报表 todo 排序、
- 广告组报表增加"不限" 
    - 老接口中的"dimension"字段增加一个取值"unlimited"
- 广告计划报表增加"不限" 
    - 老接口中的"dimension"字段增加一个取值"unlimited"    
- 广告创意报表增加"不限" 
    - 老接口中的"dimension"字段增加一个取值"unlimited"
- 关键词报表增加"不限" 
    - 老接口中的"dimension"字段增加一个取值"unlimited"       

## oppo对接 todo
- 物料推送需要进行pic_size,pic_bytes过滤
    - 广告主创意上传时 material两个字段 
        - pic_size:640_320尺寸比,
        - pic_bytes：图片字节数,如果为组图则是pic1_bytes,pic2_bytes,pic3_bytes

- 应用下载推广
  - 计划上增加字段 
    - app_pkg：app包名
    - download_link:下载链接
    - app_store_id:


        
## 老接口更改
- 广告组、计划、创意结构查询接口增加字段 query_date:要查询的最小日期，该日期之前删除的组、计划、创意会被过滤掉    
    - /promotion/fetchuseradstruct?query_date=2017/12/19
    - /promotion/fetchusertemplateads?query_date=2017/12/19