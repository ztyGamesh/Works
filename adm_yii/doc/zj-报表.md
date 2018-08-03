## 智荐报表

### 报表相关

- 管理员权限新增 /user/getcurrentuserauthority
    - +内容合作数据
    
- 报表展示
    1. 内容合作
        - 媒体列表
            - GET /contentreport/media
        - 汇总报表
             - GET /contentreport/sum?begin=20171011&end=20171011&begin_cmp=20171010&end_cmp=20171010&uid=
             -  对应字段名
             
                    "begin":开始日期 
                    "end":结束日期
                    "cost":消费 
                    "media_income":媒体收入
                    "list_pv":列表页pv 
                    "list_content_ctr":列表页内容ctr 
                    "list_ad_ctr":列表页广告ctr 
                    "detail_pv":详情页pv 
                    "detail_ad_ctr":详情页广告ctr
                    "goods_ctr":商品ctr 
                    "goods_vol":商品成交量 
                    "payment":佣金
                    
        - 折线图
             - GET /contentreport/chart?begin=20171011&end=20171011&begin_cmp=20171010&end_cmp=20171010&uid=
    2. 热门文章
        - 文章分类 
            - GET /contentreport/articleTags?top=50&begin=20171001&end=20171013
                - {"msg":"","data":[{"tag_code":"101010300","tag_name":"时尚-腕表-全部"}],"status":1}

        - 分页列表数据
             - GET /contentreport/article?limit=0&offset=5&begin=20171011&end=20171011&tag_code=a,b
    3. 热门商品
        - 分页列表数据
              - GET /contentreport/goods?limit=0&offset=5&begin=20171011&end=20171011
         

- 报表下载
    1. 内容合作： /contentreport/download?type=content&begin=20171007&end=20171012
    2. 热门文章： /contentreport/download?type=article&begin=20171007&end=20171012&offset=0&limit=50
    3. 热门商品: /contentreport/download?type=goods&begin=20171007&end=20171012&offset=0&limit=50
    
    
### 淘宝pid关联智荐id

- /feeds/getFeeds返回数据对于每一个内容合作都增加两个字段 
    - tb_media:null|string 
    - tb_pid:null|''
    
- 列表页判断 "关联pid" "修改pid" 
- 添加 修改 feeds.uid  media pid
    - POST /feeds/saveTbPid {tb_media:'a.deepleaper.com',tb_pid:'xx',uid:'智荐uid'}