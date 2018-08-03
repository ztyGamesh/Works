import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    USERINFO_INIT,
    TIME_SET,
    COVERVIEW_SET_CURRENT,
    COVERVIEW_SET_COMPARE,
    LINECHART_CURRENT_SET,
    LINECHART_COMPARE_SET,
    MEDIA_INCOMEREPORT_SET,
    SLOT_INCOMEREPORT_SET,
    TEMPLATE_INCOME_SET,
    TEMPLATE_CTR_SET
} from './MediaDashboardConstants';
// 1.折线图 某日 查询接口
function dashboardHourly(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/mediadashboardhourly',
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
            url: BUSINESSAPIHOST + '/dashboard/mediadashboarddaily',
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
            url: BUSINESSAPIHOST + '/dashboard/mediasum',
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

// 4. 样式收入排行
function dashboardTemplateIncome(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/basetemplateincometop',
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

// 5. 样式点击率排行
function dashboardTemplateCtr(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/basetemplatectr',
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

// 6. 媒体收入
function dashboardMediaIncomeReport(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/mediaincomereport',
            data: {
                sort: "income",
                order: "desc",
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

// 7. 广告主收入
function dashboardSlotIncomeReport(date) {
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/dashboard/slotincomereport',
            data: {
                sort: "income",
                order: "desc",
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

// 媒体收入
const mediaincomeSet = function (mediaIncome) {
    return {
        type: MEDIA_INCOMEREPORT_SET,
        payload: {
            mediaIncome: mediaIncome
        }
    }
}
// 广告主收入
const slotincomeSet = function (slotIncome) {
    return {
        type: SLOT_INCOMEREPORT_SET,
        payload: {
            slotIncome: slotIncome
        }
    }
}

// 样式收入排行
const templateIncome = function (templateIncome) {
    return {
        type: TEMPLATE_INCOME_SET,
        payload: {
            templateIncome: templateIncome
        }
    }
}
// 点击率收入排行
const templateCtr = function (templateCtr) {
    return {
        type: TEMPLATE_CTR_SET,
        payload: {
            templateCtr: templateCtr
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

export {
    dashboardHourly,
    dashboardDaily,
    dashboardSum,
    dashboardTemplateIncome,
    dashboardTemplateCtr,
    dashboardMediaIncomeReport,
    dashboardSlotIncomeReport,
    timeSet,
    coverviewSetCurrent,
    coverviewSetCompare,
    mediaincomeSet,
    slotincomeSet,
    templateIncome,
    templateCtr,
    lineChartCurrent,
    lineChartCompare
}
