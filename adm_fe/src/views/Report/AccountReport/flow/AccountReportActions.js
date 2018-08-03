import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    LINECHART_CURRENT_SET,
} from './AccountReportConstants';

function allianceaccount(x) {
    const {date} = x;
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/alliancereport/allianceaccount',
            data: {
                limit: 50,
                offset: 0,
                begin: date.begin,
                end: date.end
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

const lineChartCurrent = function (current) {
    return {
        type: LINECHART_CURRENT_SET,
        payload: {
            current: current
        }
    }
}
export {
    allianceaccount,
    lineChartCurrent
};
