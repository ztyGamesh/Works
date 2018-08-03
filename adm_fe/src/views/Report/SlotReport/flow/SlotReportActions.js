import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    SLOT_SET,
    SLOTCLASS_SET,
    LINECHART_CURRENT_SET,
} from './SlotReportConstants';

function allianceslot(condition) {
    const {sorter} = condition;
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/alliancereport/allianceslot',
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
// 获取所有广告类型
function getSlotClass() {
    return new Promise(function (resolve, reject) {
        request({
            method: 'post',
            url: BUSINESSAPIHOST + '/user/currentroleslotclass',
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
// 获取所有广告位
function getSlotStruct() {
    return new Promise(function (resolve, reject) {
        request({
            method: 'post',
            url: BUSINESSAPIHOST + '/media/fetchmediaslotstruct',
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

const setSlot = function (slot) {
    return {
        type: SLOT_SET,
        payload: {
            slot: slot
        }
    }
}
const setSlotClass = function (slotClass) {
    return {
        type: SLOTCLASS_SET,
        payload: {
            slotClass: slotClass
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
    allianceslot,
    getSlotClass,
    getSlotStruct,
    setSlot,
    setSlotClass,
    lineChartCurrent
};
