import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    USERINFO_INIT,
    CURRENT_DATA,
    COMPARE_DATA,
    DELTATIME
} from './AdsReportConstants';


function allianceclient(condition) {
    const {sorter} = condition;
    console.log("sorter", sorter)
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/alliancereport/clientreport',
            // url:'https://ads-api-test.deepleaper.com/alliancereport/clientreport',
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

//current数据
const currentSetData = function (current) {
    return {
        type: CURRENT_DATA,
        payload: {
            current: current
        }
    }
};
//compare数据
const compareSetData = function (compare) {
    return {
        type: COMPARE_DATA,
        payload: {
            compare: compare
        }
    }
};

//deltaTime
const deltaTimeSet = function (deltaTime) {
    return {
        type: DELTATIME,
        payload: {
            deltaTime: deltaTime
        }
    }
}
export {
    allianceclient,
    currentSetData,
    compareSetData,
    deltaTimeSet
};
