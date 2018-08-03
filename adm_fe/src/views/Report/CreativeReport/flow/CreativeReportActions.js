import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

import {
    USERINFO_INIT,
    CURRENT_DATA,
    COMPARE_DATA,
    DELTATIME,
    USERADSTRUCT_SET,
    TEMPLATES_SET
} from './CreativeReportConstants';


function adcreativereport(condition) {
    const {sorter} = condition;
    console.log("sorter", sorter)
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/alliancereport/adcreativereport',
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

//从原来系统中粘贴过来的数据templateIdArry
var templateIdArry = ['c0bb62fe-fc21-4b0b-a5c7-d547db667032', 'b2826850-b106-4cde-8a7c-d1d08dfaec7a', '7c44a357-ecd0-4c5b-80d0-db8bd5100149', '4d918595-d2a1-47c7-8e4a-012f28ddd96e', '7e1199fd-de4d-469f-8778-5de1268cddea', '6684515c-3b6d-40f5-969c-d137c3913aab', '3df90aec-8438-4f7b-96d5-0f3fd9b2a2b0'];
function fetchusertemplateads(condition) {
    const {sorter} = condition;
    console.log("sorter", sorter)
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/promotion/fetchusertemplateads',
            data: {
                ...sorter,
                template_class:templateIdArry.join(",")
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

function templates(condition) {
    const {sorter} = condition;
    console.log("sorter", sorter)
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'get',
            url: BUSINESSAPIHOST + '/template/templates',
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
//useradstruct
const useradstructSet = function (useradstruct) {
    return {
        type: USERADSTRUCT_SET,
        payload: {
            useradstruct: useradstruct
        }
    }
}
//templates
const templatesSet = function (templates) {
    return {
        type: TEMPLATES_SET,
        payload: {
            templates: templates
        }
    }
}
export {
    adcreativereport,
    currentSetData,
    compareSetData,
    deltaTimeSet,
    fetchusertemplateads,
    templates,
    useradstructSet,
    templatesSet
};
