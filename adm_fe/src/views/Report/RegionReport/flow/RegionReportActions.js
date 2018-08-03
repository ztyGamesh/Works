import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    USERINFO_INIT,
    CURRENT_DATA,
    DELTATIME,
    USERADSTRUCT_SET
} from './RegionReportConstants';


function georeport(condition) {
    const {sorter} = condition;
    console.log("sorter", sorter)
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/alliancereport/georeport',
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

function fetchuseradstruct(condition) {
    const {sorter} = condition;
    console.log("sorter", sorter)
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/promotion/fetchuseradstruct',
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

//deltaTime
const deltaTimeSet = function (deltaTime) {
    return {
        type: DELTATIME,
        payload: {
            deltaTime: deltaTime
        }
    }
}
//useradstruct
const useradstructSet = function (useradstruct) {
    return {
        type: USERADSTRUCT_SET,
        payload: {
            useradstruct: useradstruct
        }
    }
}
export {
    georeport,
    currentSetData,
    deltaTimeSet,
    fetchuseradstruct,
    useradstructSet
};
