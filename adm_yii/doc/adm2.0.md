# api列表

## 1. adx权限

## 2. 跃盟广告管理信息补充 | 广告位价格配置信息
###
> 入口url修改：/slot/slotPriceView

### 新增字段

	status enum('pause','active') DEFAULT 'active' NOT NULL COMMENT '广告位状态 pause:暂停 active:开启';
	cooperate_mode tinyint unsigned not null default 0 comment '合作方式，取值 0:固定价格 1：分成,2:底价+分城，3:技术服务费，4：公开竞价，5：cpm合约',
	price decimal(12,2) default '0.00' not null comment '底价,单位：元',
	media_share decimal(5,4) default '0.60' not null comment '媒体分成比例,默认60%',
	profit_rate decimal(10,4) default '0.20' not null comment '利润率',
	profit_price decimal(10,4) default '0.00' not null comment '广告成本=底价/（1-最低利润率）',
	slot_link：广告位链接（todo=>和前端确认）
	
---
### 接口
#### 获取列表		
- /user/templateprofitrate?order=desc&limit=50&offset=0
	新接口===>>/slot/statusPriceList?order=desc&limit=50&offset=0
	
#### 修改价格、合作模式等

- /user/savetemplateprofitrate 
	新接口========> POST /slot/savePriceConf  []

#### 修改广告位状态
- /slot/saveStatus post方式
{
	uid:'',
	status:'pause'/'active'
}

---
### 后台开发时注意事项
- 创建广告位时发邮件，自动生成价格模板参数(插入到slot,slot_price_history)
- 修改广告位价格配置时，同时更新slot,slot_price_history

## 3. 流量接入开关
- 媒体列表，增加一列媒体状态 启用、冻结，新建媒体默认为启用，管理员端可以修改，媒体端只能查看 
	- 获取列表数据增加一列 status:pause,active 
		- /media/media?search=&sort=create_time&order=desc&limit=50&offset=0
	- 修改状态 
		- post /media/status {uid:'媒体uid',status:pause/active}

- 广告位列表增加一列状态开关，默认为开启
	- 获取列表增加一列 status: active:开启 pause：暂停
	- 修改状态 post /slot/saveStatus {uid:'广告位uid',status:pause/active}


## 4. 媒体应用平台 android/ios
- 媒体类型为应用时要进行设置，不支持修改，旧数据为空
- 新增字段 platform: android:安卓, ios:苹果

## 5. 行业屏蔽
- 媒体行业屏蔽
	- 跃盟在添加-修改媒体时可以进行行业屏蔽设置，字段名black_industry,数据以逗号拼接，复用老接口
	- 媒体在媒体列表处可以查看设置广告屏蔽，复用老接口
- 广告位行业屏蔽
	- 添加广告位时增加字段 black_industry

## 6. 平台媒体合作模式
- 媒体创建广告位后或者ssp自动创建广告位后，给跃盟运营人员发送邮件通知，
	-  邮件格式。。。。
- 删除广告位中的“结算价设置”，不允许媒体修改结算价 前端去掉，slot_template表删除price字段
- 跃盟内部设置广告位合作模式
    - 获取列表信息 新增接口 /slot/getStatusAndPriceConf?order=desc&limit=50&offset=0 
    - 广告位状态修改保存 新增接口 POST /slot/saveStatus {uid:'',status:''}
        - uid:广告位uid
        - status：广告位状态 active：开启 pause:暂停
	- 广告位价格修改保存  新增接口 POST /slot/savePriceConf  {uid:'广告位uid',....}
		- cooperate_mode:合作方式，取值 0:固定价格 1：分成,2:底价+分城，3:技术服务费，4：公开竞价，5：cpm合约
		- price：底价 小数
		- media_share：媒体分成比例 整数
		- profit_rate: 利润率 整数
		- profit_price:广告成本 小数
		- slot_link：广告位链接
- 平台与广告主合作模式
	- 删除广告形式(动态-静态信息流)
	- 计费方式：竞价广告支持CPM/CPC,合约广告支持CPM，该字段不允许修改【本期不做】

## 7. 新增广告形式-模板样式

```$xslt
templates:
-- 8种模板样式
[{
        "uid": "8be1afb6-8d5c-4be9-917d-5d187ae03a48",
        "name": "静态开屏"
    }, {
        "uid": "876de12b-5e92-41da-a4a3-2f9fa33eda33",
        "name": "动态开屏"
    }, {
        "uid": "7d42ec85-5533-4390-9338-84bfb0f725b5",
        "name": "视频开屏"
    }, {
        "uid": "b62e5dfa-a628-4ddc-a2ef-c43e62feb318",
        "name": "横幅-纯图"
    }, {
        "uid": "3fc13471-36a1-4dfc-abde-98c364e78e2e",
        "name": "横幅-图文"
    }, {
        "uid": "5e0e3da8-e3cc-4330-a409-ee7263a08711",
        "name": "插屏-纯图"
    }] 
```
```$xslt
slot_classes:
-- 3种广告位样式 slot_class表
{ "uid": "987b7cd8-2752-4a15-bc94-6c0a2764a5c4", "name": "开屏"},
{"uid": "7b62026a-23aa-4592-836a-f4ee78f7ea2e", "name": "横幅"}, 
{ "uid": "5b3e416f-d93a-4632-87de-5d4fbcc942fb", "name": "插屏"}
```

- ssp
	- 媒体添加广告位时，广告形式动态信息流、开屏、插屏、横幅
		- 提供api获取广告形式+模板样式，广告形式-模板样式联动
            - GET /slot/getAdFormats 
        - slot_template表setting
        * 开屏广告：
        //前端传过来这个配置数据
        {
        "pic_setting":{"scale":"16_9","format":["dynamic_pic","static_pic"]},//??
        "video_setting":{"format":["mp4"]},
        "title_setting":{"font":"","font-size":"14","font-color":"#000000","length":"21"},
        "description_setting":{"font":"","font-size":"12","font-color":"#000000","length":"23"},
        "display_time":3,//开屏时长,单位s -----新增
        "clickable":[0,1],//是否可点击    -----新增
        "display_type":["float","fixed"],//广告位接入方式 悬浮、嵌入  ---- 新增
        }
        setting_old = {
            "pic_setting": {"scale": "16_9", "format": ["dynamic_pic", "static_pic"]},
            "video_setting": {"format": ["mp4"]},
            "title_setting": {"font": "", "font-size": "14", "font-color": "#000000", "length": "21"},
            "description_setting": {"font": "", "font-size": "12", "font-color": "#000000", "length": "23"},
            "display_time": 3,//开屏时长,单位s -----新增
            "clickable": [0, 1],//是否可点击    -----新增
            "display_type": "float" / "embedded",//广告位接入方式 悬浮、嵌入  ---- 新增
        };
        
        setting_new = {
            "pic_setting": {
                "scale": "16_9", "format": ["dynamic_pic", "static_pic"],
                "display_time": 3,//图片开屏时长,单位s -----新增
                "clickable": [0, 1],//是否可点击    -----新增
            },
            "video_setting": {
                "format": ["mp4"],
                "display_time": 3,//视频开屏时长,单位s -----新增
                "clickable": [0, 1],//是否可点击    -----新增
            },
            "display_setting":{// 广告展示设置 -- 新增
                "display_type": "float" / "embedded",//横幅广告位接入方式 悬浮、嵌入  ---- 新增
            },
            "title_setting": {"font": "", "font-size": "14", "font-color": "#000000", "length": "21"},
            "description_setting": {"font": "", "font-size": "12", "font-color": "#000000", "length": "23"}
        };

        * 横幅 .gif 5s 

        * 视频 .mp4 5s

    - 保存api /media/feedsslotadd
        - todo 前端把固定信息流的基础模板转换为动态信息流的基础模板  
        - 新建发送邮件
- dsp创意配置
	- 计划上删除广告形式，创意上添加广告形式，动态信息流和固定信息流合并为信息流
    - 获取广告形式 - GET /slot/getAdFormats  
    - dsp:  /material/uploadfile=>上传视频  /material/uploadimagewithdetail=>上传图片
            创意 ad_creative：
            {
            "pic":"6eee5b3c-82f8-493c-ac6d-b056f40417ae.jpg",//图片地址
            "pic_scale":"3_2",//图片比例
            "title":"\u8fd9\u662f\u521b\u610f\u6807\u9898",//标题
            "description":"\u8fd9\u662f\u521b\u610f\u63cf\u8ff0",//描述
            "clickable":0/1,//是否可点击
            }

            //组图模板
            {
            "pic1":"906892e0-58f9-45f6-b785-3b06965f3cb8.jpg",
            "pic2":"9c813e9d-5ca4-4db4-92e1-3c15f48ce72d.jpg",
            "pic3":"c17cc604-6189-4fdb-b92f-6e1eaeb617f1.jpg",
            "pic_scale":"32_21",
            "title":"\u5927\u56fe+\u6587\u5b57\u6a21\u677fZYV3GF",
            "description":""
            }
            //视频
            {"pic":"8528304d-c312-44b4-9456-23cd19c93064.jpeg",
            "pic_scale":"4_3",
            "video":"12f63a5b-087c-414f-aecc-93645d00a1aa.mp4"}
	

----
开发顺序：1-5-3-6-7-2-4
#TODO
-  价格调整页面权限控制
-  根据
