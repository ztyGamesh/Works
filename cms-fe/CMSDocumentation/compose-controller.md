# compose-controller: 创作

编辑角色进入 **发布新作品** 页面: `/compose/entry`<br>
选择

```
- 图文
- 图集
- 视频(还未开放，不在本文档说明当中)
```

**简要描述：**

- 发布新作品->图文->保存
- 发布新作品->图文->提交
- 发布新作品->图集->保存
- 发布新作品->图集->提交

**请求URL：**

- `SERVICE_API_URL/api/compose/replace`

**请求方式：**

- POST

**参数：**

参数名         | 必选 | 类型     | 说明
:---------- | :- | :----- | -----------------
compose     | 是  | object | 作品内容主体
displayInfo | 是  | object | 封面图内容主体
goods       | 否  | array  | 作品中的商品(如果没有可以就不传)

**返回示例**

```
  {
    "data": "",
    "message": "",
    "status": "ok" or "failed",
  }
```

**返回参数说明**

参数名     | 类型     | 说明
:------ | :----- | --------------------------
data    | string | 如果status为"ok"，则会返回作品的uid的值
message | string | 显示给后台开发人员看的相关信息
status  | string | "ok"代表请求成功 "failed"代表请求失败

**备注**

- compose 对象中的参数说明

字段            | 类型     | 必填 | 注释
:------------ | :----- | -- | -------------------------
auditStatus   | number | 是  | 审核状态 0:保存 1:未审核 2:拒绝 3:通过
category      | string | 是  | 作品的分类: 例如"101040300"
content       | string | 是  | 详情页的html
createUser    | string | 是  | 创建人的user
editorContent | string | 是  | 编辑器内部的html
machineTag    | string | 是  | 作品的关键字 例如"篮球,足球"
marksman      | number | 是  | 作品的马甲名 例如 1
tag           | string | 是  | 作品的标签 例如"篮球,羽毛球"
title         | string | 是  | 作品的标题
type          | number | 是  | 作品的内容类型 图文:1 图集:2 视频:3

- displayInfo 对象中的参数说明

字段    | 类型     | 空 | 注释
:---- | :----- | - | -------------------------
cover | string | 是 | 封面图包装后的数据结构是一个json格式字符串
title | string | 是 | 文章标题
type  | number | 是 | 封面图展示类型 大图+标题:1 单图:2 三图:3

备注:

> 对于cover字段，分三种情况:

> - 大图+标题: {pic: "url"}
> - 单文: {pic: "url"}
> - 三图: {pics: ["url", "url", "url"]} 注意这里是pics！

- goods 对象中的参数说明

字段         | 类型     | 必填 | 注释
:--------- | :----- | -- | ----------------------------
cover      | string | 否  | 商品主图url
createUser | string | 否  | 商品创建人的user
goodsId    | string | 否  | 商品id
price      | number | 否  | 商品价格 精确到分 例如 70.88RMB应该为7088
source     | string | 否  | 商品来源 目前只有 "taobao"
title      | string | 否  | 商品标题
**uid**    | string | 是  | 商品uid 为必填项
url        | string | 否  | 商品的详情页url
