import {
    USERINFO_INIT,
    CURRENT_DATA,
    DELTATIME,
    USERADSTRUCT_SET
} from './RegionReportConstants';

const initState = {
    // CoverView的数据
    current: {
        city:[],
        province:[],
        report:{
            rows:[],
            total: ""
        },
    },
    useradstruct:{
        data:[]
    },
    deltaTime: 0

};

export default function depositoryReducers(state = initState, action) {
    const {type, payload} = action;
    switch (type) {
        case USERINFO_INIT:
            return initState;
        case CURRENT_DATA:
            return {
                // set COVERVIEWCURRET 日期
                ...state,
                current: payload.current
            };
        case DELTATIME:
            return {
                ...state,
                deltaTime: payload.deltaTime
            };
        case USERADSTRUCT_SET:
            return {
                ...state,
                useradstruct: payload.useradstruct
            }
        default:
            return {...state}
    }
}
