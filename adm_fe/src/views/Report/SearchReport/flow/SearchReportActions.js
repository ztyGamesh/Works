import request from '../../../../utils/request';
import {BUSINESSAPIHOST} from '../../../../common/env';

// 处理否定关键词请求
function appendWords(condition,matchType) {
    const {query, plan_id} = condition;
    // date是查询日期条件
    return new Promise(function (resolve, reject) {
        request({
            method: 'post',
            url: BUSINESSAPIHOST + '/adplan/appendWords',
            data: [{
                word: query,
                plan_id: plan_id,
                target_type: 2,
                match_type: matchType
            }]
        }).then(res=> {
            if (res.status == 1) {
                resolve({code: 1, data: res.data});
            } else {
                resolve({code: 0, msg: res.msg});
            }
        });
    })
}

export {
    appendWords
};