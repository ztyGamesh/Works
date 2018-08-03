import {message} from 'antd';
import {USERINFO_SET_USERNAME, USERINFO_SET_UID, USERINFO_INIT, USERINFO_SET_ROLE} from './constants';
import {BUSINESSAPIHOST} from '../../../common/env';
import request from '../../../utils/request'
import {setAuthority} from '../../../utils/authority'
//初始化数据
export const init = function () {
    return {
        type: USERINFO_INIT
    }
};
//修改用户名
export const setUserName = function (userName) {
    return {
        type: USERINFO_SET_USERNAME,
        payload: {
            userName: userName
        }
    }
};
//修改用户ID
export const setUid = function (uid) {
    return {
        type: USERINFO_SET_UID,
        payload: {
            uid: uid
        }
    }
};
//修改用户角色
export const setRole = function (role) {
    return {
        type: USERINFO_SET_ROLE,
        payload: {
            role: role
        }
    }
};
//请求用户信息ajax
function userInfoAjax() {
    return new Promise(function (resolve, reject) {
        request({
            method: 'post',
            url: BUSINESSAPIHOST + '/user/getcurrentuserauthority',
            data: {}
        }).then(res=> {
            if (res.status == 1) {
                let role = '';
                if (res.user.power == 'admin') {//管理员
                    role = 0;
                } else if (res.user.power == 'admin_price') {//底价管理员
                    role = 3;
                } else if (res.user.power == 'admin_audit') {//审核管理员
                    role = 4;
                } else {
                    switch (res.user.role) {//媒体或广告主
                        case 'media':
                            role = 1;
                            break;
                        case 'client':
                            role = 2;
                            break;
                    }
                }
                resolve({
                    code: 1,
                    userName: res.user.name,
                    uid: res.user.uid,
                    role: role,
                });
            } else {
                resolve({code: 0});
            }
        });
    })
}
//请求用户信息action
export const requestUserInfo = function () {
    return async(dispatch, getState) => {
        const responseData = await userInfoAjax();
        if (responseData.code == 1) {
            dispatch(setUserName(responseData.userName));
            dispatch(setUid(responseData.uid));
            dispatch(setRole(responseData.role));
            setAuthority(responseData.role);
        } else {
            message.error('请求用户信息失败！');
            dispatch(setUserName('未知'));
        }
    }
};