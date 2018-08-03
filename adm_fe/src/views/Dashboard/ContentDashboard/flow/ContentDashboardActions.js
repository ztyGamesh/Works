import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

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
// 1.mediaList 查询接口
function mediaListAPI() {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/contentreport/media',
            data: {}
        }).then(res=> {
            if (res.status == 1) {
                resolve({code: 1, data: res.data});
            } else {
                resolve({code: 0});
            }
        });
    })
}

// 2.coverView查询接口
function sumAPI(option) {
    //option是查询条件集合
    const {begin,end,begin_cmp,end_cmp,uid} = option;
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/contentreport/sum',
            data: {
                begin: begin,
                end: end,
                begin_cmp: begin_cmp,
                end_cmp: end_cmp,
                uid: uid || ""
            }
        }).then(res=> {
            if (res.status == 1) {
                resolve({code: 1, data: res.data});
            } else {
                resolve({code: 0});
            }
        });
    })
}

// 3.折线图查询接口
function chartAPI(option) {
    //option是查询条件集合
    const {begin,end,begin_cmp,end_cmp,uid} = option;
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/contentreport/chart',
            data: {
                begin: begin,
                end: end,
                begin_cmp: begin_cmp,
                end_cmp: end_cmp,
                uid: uid || ""
            }
        }).then(res=> {
            if (res.status == 1) {
                resolve({code: 1, data: res.data});
            } else {
                resolve({code: 0});
            }
        });
    })
}

// 4. 热门文章查询接口
function articleAPI(option) {
    //option是查询条件集合
    const {begin,end} = option;
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/contentreport/article',
            data: {
                sort: "clk",
                order: "desc",
                limit: 10,
                offset: 0,
                begin: begin,
                end: end,
                tag_code: ""
            }
        }).then(res=> {
            if (res.status == 1) {
                resolve({code: 1, data: res.data});
            } else {
                resolve({code: 0});
            }
        });
    })
}

// 5. 热门商品查询接口
function goodsAPI(option) {
    //option是查询条件集合
    const {begin,end} = option;
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/contentreport/goods',
            data: {
                sort: "clk",
                order: "desc",
                limit: 10,
                offset: 0,
                begin: begin,
                end: end,
            }
        }).then(res=> {
            if (res.status == 1) {
                resolve({code: 1, data: res.data});
            } else {
                resolve({code: 0});
            }
        });
    })
}


/*set media筛选媒体列表数据*/
const mediaSet = function (data) {
    return {
        type: MEDIALIST_SET,
        payload: {
            media: data
        }
    }
}
/*set CoverView 数据*/
const sumSet = function (data) {
    return {
        type: COVERVIEW_SET,
        payload: {
            coverView: data
        }
    }
}
/*set 折线图 数据*/ 
const chartSet = function (data) {
    return {
        type: LINECHART_SET,
        payload: {
            chart: data
        }
    }
}
/*set 热门文章排行榜数据*/
const articleSet = function (data) {
    return {
        type: ARTICLEREPORT_SET,
        payload: {
            article: data
        }
    }
}
/*set 热门商品排行榜数据*/
const goodsSet = function (data) {
    return {
        type: GOODSREPORT_SET,
        payload: {
            goods: data
        }
    }
}

/*set 当前页面的查询条件*/
const sorterSet = function (sorter) {
    return {
        type: SORTER_SET,
        payload: {
            sorter: sorter
        }
    }
}
export {
    mediaListAPI,
    sumAPI,
    chartAPI,
    articleAPI,
    goodsAPI,
    mediaSet,
    sumSet,
    chartSet,
    articleSet,
    goodsSet,
    sorterSet
}
