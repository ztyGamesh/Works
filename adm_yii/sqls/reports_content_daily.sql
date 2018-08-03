# 内容合作报表页面 媒体列表

SELECT DISTINCT u.uid,u.name
FROM feeds f
  JOIN media m on f.media_uid=m.uid
  JOIN user u on u.uid= m.medium
WHERE f.pid ='';


# 内容合作页面 -- 查询报表汇总行（时间+user.uid维度）

SELECT
  sum(list_ad_cost+detail_ad_cost+tb_payment) as cost,
  sum(media_income) as media_income,
  sum(list_pv) as list_pv,
  sum(list_content_clk)/sum(list_content_pv) as list_content_ctr,
  sum(list_ad_clk)/sum(list_ad_pv) as list_ad_ctr,
  sum(detail_pv) as detail_pv,
  sum(detail_ad_clk)/sum(detail_ad_pv) as detail_ad_ctr,
  sum(detail_goods_clk)/sum(detail_goods_pv) as goods_ctr,
  sum(tb_vol) as goods_vol,
  sum(tb_payment) as payment
FROM reports_content_daily rc
WHERE 1
      and (date >="2017-10-10" and date<="2017-10-11")
      and (user_id in("11","user-2"));


# 内容合作页面--折线图对比数据
SELECT
  d.date,
  sum(list_ad_cost+detail_ad_cost+tb_payment) as cost,
  sum(media_income) as media_income,
  sum(list_pv) as list_pv,
  sum(list_content_clk)/sum(list_content_pv) as list_content_ctr,
  sum(list_ad_clk)/sum(list_ad_pv) as list_ad_ctr,
  sum(detail_pv) as detail_pv,
  sum(detail_ad_clk)/sum(detail_ad_pv) as detail_ad_ctr,
  sum(detail_goods_clk)/sum(detail_goods_pv) as goods_ctr,
  sum(tb_vol) as goods_vol,
  sum(tb_payment) as payment
FROM reports_content_daily rc
  RIGHT JOIN dic_date d  on d.date=rc.date and (user_id in(11,"user-2"))
WHERE 1 and (d.date >="2017-10-01" and d.date<="2017-10-11")
GROUP BY d.date;

# 内容合作页面 --报表下载

SELECT
  media_id,
  media_name,
  user_mail,
  /* 消费 */    sum(list_ad_cost+detail_ad_cost+tb_payment) as cost,
  /* 媒体收入 */ sum(media_income) as media_income,
  /* 列表页pv */     sum(list_pv) as list_pv,
  /* 媒体dau */   sum(dau) as dau,
  /* 用户平均刷新次数 */ sum(list_pv)/sum(dau) as avg_refresh_cnt,
  /* 列表页内容条数 */ sum(list_content_pv) as list_content_pv,
  /* 列表页内容点击 */ sum(list_content_clk) as list_content_clk,
  /* 列表页内容CTR */ sum(list_content_clk)/sum(list_content_pv) as list_content_ctr,

  /* 列表页广告展示 */ sum(list_ad_pv) as list_ad_pv,
  /* 列表页广告点击 */ sum(list_ad_clk) as list_ad_clk,
  /* 列表页广告ctr */ sum(list_ad_clk)/sum(list_ad_pv) as list_ad_ctr,
  /* 列表页广告消费 */ sum(list_ad_cost) as list_ad_cost,
  /* 列表页广告ecpm */ sum(list_ad_cost)/sum(list_ad_pv)*1000 as list_ad_ecpm,

  /* 详情页商品展示  */ sum(detail_goods_pv) as detail_goods_pv,
  /* 详情页商品点击  */ sum(detail_goods_clk) as detail_goods_clk,
  /* 详情页商品ctr  */ sum(detail_goods_clk)/sum(detail_goods_pv) as detail_goods_ctr,

  /* 详情页广告pv */ sum(detail_ad_pv) as detail_ad_pv,
  /* 详情页广告点击 */ sum(detail_ad_clk) as detail_ad_clk,
  /* 详情页广告消费 */ sum(detail_ad_cost) as detail_ad_cost,
  /* 详情页广告CTR */ sum(detail_ad_clk)/sum(detail_ad_pv) as detail_ad_ctr,
  /* 详情页广告ecpm */ sum(detail_ad_cost)/sum(detail_ad_pv)*1000 as detail_ad_ecpm,

  /* 商品成交量 */ sum(tb_vol) as tb_vol,
  /* 佣金 */ sum(tb_payment) as tb_payment
FROM reports_content_daily rc
WHERE rc.date >= "2017-09-01" and rc.date<="2017-10-21"
GROUP BY rc.media_id;


# 热门文章
# 查询热门文章分类
SELECT DISTINCT tag_code,tag_name
FROM (
       SELECT
         tag_code,
         tag_name,
         sum(clk) as clk
       FROM reports_article_daily
       WHERE date>='20171001' and date<='20171013'
       GROUP BY article_id
       ORDER BY clk DESC
       LIMIT 0,50
     ) as t1;
# 根据时间、分类获取文章列表并根据文章点击数倒排分页
SELECT
  article_id,
  title,
  sum(clk) AS clk,
  tag_name,
  tag_code
FROM reports_article_daily
WHERE date >= '2017-10-01' AND date <= '2017-10-13' AND tag_code IN (101010300, 101010400)
GROUP BY article_id
ORDER BY clk DESC
LIMIT 0, 2;

# 热门商品

SELECT
  goods_id,
  name,
  price,
  rato,
  sum(clk) as clk
FROM reports_goods_daily
WHERE date >= '2017-10-01' AND date <= '2017-10-13'
GROUP BY goods_id
ORDER BY clk DESC
LIMIT 0, 2;

# 商品名称、价格、比率以最近一天的为准 todo
SELECT
  goods_id,
  name,
  ROUND(price,2) as price,
  ROUND(rato,2) as rato,
  sum(clk) as clk
FROM reports_goods_daily
WHERE date >= '2017-10-01' AND date <= '2017-10-13'
GROUP BY goods_id
ORDER BY clk DESC
LIMIT 0, 2;
# todo
SELECT t1.clk,t2.*
FROM (
       SELECT
         goods_id,
         sum(clk) AS clk
       FROM reports_goods_daily
       WHERE date >= '2017-10-01' AND date <= '2017-10-13'
       GROUP BY goods_id
       ORDER BY clk DESC
       LIMIT 0, 5
     ) t1
  JOIN (SELECT
          goods_id,
          name,
          price,
          rato
        FROM reports_goods_daily
        WHERE goods_id IN ("商品id-1", "商品id-2", "商品id-3") AND date = '2017-10-12' -- TODO 日期数据待定

       ) AS t2 on t1.goods_id=t2.goods_id;


