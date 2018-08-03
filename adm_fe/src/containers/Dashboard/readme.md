# Dashboard页面所用接口 <!-- zty重构时整理，有更新会维护 -->

## MediaDashboard(SSP)

`域名: http://publisher-api-dev.deepleaper.com`

> 1. 折线图使用(单天): /dashboard/mediadashboardhourly?begin=2018/05/02&end=2018/05/02&dimesion=imp,clk,ctr,income,ecpm,ecpc
> 2. 折线图使用(时期): /dashboard/mediadashboarddaily?begin=2018/05/02&end=2018/06/20&dimesion=imp,clk,ctr,income,ecpm,ecpc
> 3. 概览使用x2: /dashboard/mediasum?begin=2018/05/01&end=2018/05/03
> 4. 媒体收入: /dashboard/mediaincomereport?sort=incomeℴ=desc&begin=2018/05/02&end=2018/05/03⊤=5
> 5. 广告主收入: /dashboard/slotincomereport?sort=incomeℴ=desc&begin=2018/05/02&end=2018/05/03⊤=5
> 6. 样式收入排行: /dashboard/basetemplateincometop?begin=2018/05/01&end=2018/05/03⊤=5
> 7. 样式点击率排行: /dashboard/basetemplatectr?begin=2018/05/01&end=2018/05/03⊤=5
