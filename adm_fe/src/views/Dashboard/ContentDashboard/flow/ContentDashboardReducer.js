import {
    USERINFO_INIT,
    TIME_SET,
    MEDIALIST_SET,
    COVERVIEW_SET,
    LINECHART_SET,
    ARTICLEREPORT_SET,
    GOODSREPORT_SET,
    SORTER_SET
} from './ContentDashboardContants.js';

const initState = {
    /*存储 media筛选媒体列表数据*/
    media: {},
    /*存储CoverView 数据*/
    coverView: {},
    /*存储折线图 数据*/ 
    chart: {},
    /*存储 热门文章排行榜数据*/
    article: {},
    /*存储 热门商品排行榜数据*/
    goods: {},
    /*存储 当前页面的查询条件*/
    sorter: {}
};

export default function depositoryReducers(state = initState, action) {
    const {type, payload} = action;
    switch (type) {
        case USERINFO_INIT:
            return initState;
        case MEDIALIST_SET:
            return {
                /*set media筛选媒体列表数据*/
                ...state,
                media: payload.media
            };
        case COVERVIEW_SET:
            return {
                /*set CoverView 数据*/
                ...state,
                coverView: payload.coverView
            };
        case LINECHART_SET:
            return {
                //*set 折线图 数据*/ 
                ...state,
                chart: payload.chart
            };
        case ARTICLEREPORT_SET:
            return {
                /*set 热门文章排行榜数据*/
                ...state,
                article: payload.article
            };
        case GOODSREPORT_SET:
            return {
                /*set 热门商品排行榜数据*/
                ...state,
                goods: payload.goods
            };
        case SORTER_SET:
            return {
                ...state,
                sorter: payload.sorter
            }
        default:
            return {...state}
    }
}














