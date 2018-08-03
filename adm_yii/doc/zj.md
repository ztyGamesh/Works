## 媒体/内容合作

- 内容合作页面 /media/feeds
    - 获取媒体列表 GET /media/getMediaList?fields=name,uid&type=3
        
- 显示创建页面
	- GET /feeds/create
- 查看某一内容合作的页面
	- GET /feeds/show?uid=xxx	
- 编辑页面
	- GET /feeds/edit?uid=xxx
- 保存新增
	- POST /feeds/store
		- data:
			
			```
			//媒体uid
			'media_uid'=>'2f927c49-bdbe-4a9e-a171-5938c73dca7f',
			//合作名称
            'cooperate_name'=>'媒体合作-x',
            //接入方式
            'use_mode'=>'api',
            //内容数量
            'content_count'=>6,
            //广告数量
            'ad_count'=>1
			```
- 保存修改
	- POST /feeds/update
- 查询
	- 查询所有的内容合作 GET /feeds/getFeeds?分页参数(同以前)
	- 查询某一个内容合作 GET /feeds/getFeeds?uid=xxx