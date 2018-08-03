import user from './views/UserInfo/flow/userInfoReducers';
import aFeedOperateReducers from './views/Feeds/AFeedOperate/flow/AFeedOperateReducer';

// 媒体dashboard reducer
import mediaDashboardReducers from './views/Dashboard/MediaDashboard/flow/MediaDashboardReducer';

// 广告主dashboard reducers
import clientDashboardReducers from './views/Dashboard/ClientDashboard/flow/ClientDashboardReducer';

// 内容合作页面 dashboard reducers
import contentDashboardReducers from './views/Dashboard/ContentDashboard/flow/ContentDashboardReducer';

// 媒体 数据报表 账户报表reducer
import accountReportReducers from './views/Report/AccountReport/flow/AccountReportReducers';
// 媒体 媒体报表 媒体账户reducer
import mediaReportReducers from './views/Report/MediaReport/flow/MediaReportReducers';
// 媒体 广告位报表
import slotReportReducers from './views/Report/SlotReport/flow/SlotReportReducers';
// 媒体 样式报表
import templateReducers from './views/Report/TemplateReport/flow/TemplateReducers';

//广告主 账户报表
import adsReportReducers from './views/Report/AdsReport/flow/AdsReportReducers';
//广告主 推广组报表
import groupReportReducers from './views/Report/GroupReport/flow/GroupReportReducers';
//广告主 推广计划报表
import planReportReducers from './views/Report/PlanReport/flow/PlanReportReducers';
//广告主 推广创意报表
import creativeReportReducers from './views/Report/CreativeReport/flow/CreativeReportReducers';
//广告主 关键词报表
import keywordReportReducers from './views/Report/KeywordReport/flow/KeywordReportReducers';
//广告主 地域报表
import regionReportReducers from './views/Report/RegionReport/flow/RegionReportReducers';
//关键词上传工具
import keywordsUploadReducers from './views/Tools/KeywordsUpload/flow/KeywordsUploadReducers';


const reducers = {
    user,
    aFeedOperateReducers,
    mediaDashboardReducers,
    clientDashboardReducers,
    contentDashboardReducers,
    accountReportReducers,
    mediaReportReducers,
    slotReportReducers,
    templateReducers,
    adsReportReducers,
    groupReportReducers,
    planReportReducers,
    creativeReportReducers,
    keywordReportReducers,
    regionReportReducers,
    keywordsUploadReducers,
};
export default reducers;
