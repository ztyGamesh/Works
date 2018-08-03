import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';


import {
    USERINFO_INIT,
    MEDIALIST_SET,
    LINECHART_CURRENT_SET,
} from './MediaReportConstants';

function getMedialist() {
    // 筛选媒体的媒体列表
    return new Promise(function (resolve, reject) {
        request({
            method: 'post',
            url: BUSINESSAPIHOST + '/media/medialist',
            data: {
                data_type: 'uid'
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

function alliancemedia(condition) {
    const {sorter} = condition;
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/alliancereport/alliancemedia',
            data: {
                ...sorter
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

const setmediaList = function (mediaList) {
    return {
        type: MEDIALIST_SET,
        payload: {
            mediaList: mediaList
        }
    }
}

const lineChartCurrent = function (current) {
    return {
        type: LINECHART_CURRENT_SET,
        payload: {
            current: current
        }
    }
}

export {
    getMedialist,
    alliancemedia,
    setmediaList,
    lineChartCurrent
};
