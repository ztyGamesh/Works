import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    USERINFO_INIT,
    TIME_SET,
    COVERVIEW_SET_CURRENT,
    COVERVIEW_SET_COMPARE,
    LINECHART_CURRENT_SET,
    LINECHART_COMPARE_SET,
    KEYWORD_CURRENT_SET,
    KEYWORD_COMPARE_SET,
    AD_GROUP_TOP,
    AD_PLAN_TOP,
} from './ClientDashbaordConstants';
// 1.折线图 某日 查询接口
function dashboardHourly(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/clientdashboardhourly',
            data: {
                begin: date.begin,
                end: date.end,
                dimension:"imp,clk,ctr,income,ecpm,ecpc"
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

// 2.折线图 某段日期 查询接口
function dashboardDaily(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/clientdashboarddaily',
            data: {
                begin: date.begin,
                end: date.end,
                dimension:"imp,clk,ctr,income,ecpm,ecpc"
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

// 3.概览
function dashboardSum(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/clientsum',
            data: {
                begin: date.begin,
                end: date.end,
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

// 4. 广告组
function dashboardADGroupTop(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/adgrouptop',
            data: {
                begin: date.begin,
                end: date.end,
                top: 5
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

// 5. 广告计划
function dashboardADPlanTop(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/adplantop',
            data: {
                begin: date.begin,
                end: date.end,
                top: 5
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

// 6. 关键字
function dashboardWordTop(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/wordtop',
            data: {
                sort: "income",
                order: "desc",
                begin: date.begin,
                end: date.end,
                top: 20
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

// 记录跟time相关的 包括current 和 compare
const timeSet = function (time) {
    return {
        type: TIME_SET,
        payload: {
            time: time
        }

    }
}

//修改coverView的current
const coverviewSetCurrent = function (current) {
    return {
        type: COVERVIEW_SET_CURRENT,
        payload: {
            current: current
        }
    }
};
//修改coverView的compare
const coverviewSetCompare = function (compare) {
    return {
        type: COVERVIEW_SET_COMPARE,
        payload: {
            compare: compare
        }
    }
};

// 广告组
const adgrouptopSet = function (adgrouptop) {
    return {
        type: AD_GROUP_TOP,
        payload: {
            adgrouptop: adgrouptop
        }
    }
}
// 广告计划
const adplantopSet = function (adplantop) {
    return {
        type: AD_PLAN_TOP,
        payload: {
            adplantop: adplantop
        }
    }
}

// 当前选中时间段数据
const lineChartCurrent = function (current) {
    return {
        type: LINECHART_CURRENT_SET,
        payload: {
            current: current
        }
    }
}
// 对比时间段数据
const lineChartCompare = function (compare) {
    // console.log("reducers", compare)
    return {
        type: LINECHART_COMPARE_SET,
        payload: {
            compare: compare
        }
    }
}
// 当前选中时间关键词
const wordTopCurrent = function (current) {
    return {
        type: KEYWORD_CURRENT_SET,
        payload: {
            current: current
        }
    }
}
// 对比时间时间关键词
const wordTopCompare = function (compare) {
    return {
        type: KEYWORD_COMPARE_SET,
        payload: {
            compare: compare
        }
    }
}
export {
    dashboardHourly,
    dashboardDaily,
    dashboardSum,
    dashboardADGroupTop,
    dashboardADPlanTop,
    dashboardWordTop,
    timeSet,
    coverviewSetCurrent,
    coverviewSetCompare,
    adgrouptopSet,
    adplantopSet,
    lineChartCurrent,
    lineChartCompare,
    wordTopCurrent,
    wordTopCompare
}
