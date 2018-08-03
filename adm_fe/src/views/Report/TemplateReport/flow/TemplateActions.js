import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    SLOT_SET,
    SLOTTEMPLATE_SET,
    LINECHART_CURRENT_SET,
} from './TemplateConstants';

function alliancetemplate(condition) {
    const {sorter} = condition;
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/alliancereport/alliancetemplate',
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

// 获取所有广告位样式
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

const setSlotTemplate = function (slotTemplate) {
    return {
        type: SLOTTEMPLATE_SET,
        payload: {
            slotTemplate: slotTemplate
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
    alliancetemplate,
    getSlotStruct,
    setSlotTemplate,
    lineChartCurrent
};
