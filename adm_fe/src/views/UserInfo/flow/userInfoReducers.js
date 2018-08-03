import {USERINFO_SET_USERNAME, USERINFO_SET_UID, USERINFO_INIT, USERINFO_SET_ROLE} from './constants';
/**
 * @role:用户角色 0-管理员 1-媒体 2-广告主 3-底价管理员 4-关键词管理员
 * */
const initState = {
    userName: '',
    uid: '',
    role: null
};

export default function user(state = initState, action) {
    const {type, payload} = action;
    switch (type) {
        case USERINFO_INIT:
            return initState;
        case USERINFO_SET_USERNAME:
            return {
                ...state,
                userName: payload.userName
            };
        case USERINFO_SET_UID:
            return {
                ...state,
                uid: payload.uid
            };
        case USERINFO_SET_ROLE:
            return {
                ...state,
                role: payload.role
            };
        default:
            return {...state}
    }
}