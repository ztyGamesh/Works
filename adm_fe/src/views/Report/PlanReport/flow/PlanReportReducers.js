import {
    USERINFO_INIT,
    CURRENT_DATA,
    COMPARE_DATA,
    DELTATIME,
    USERADSTRUCT_SET
} from './PlanReportConstants';

const initState = {
    // CoverView的数据
    current: {
        chart:[],
        report:{
            rows:[],
            total: ""
        },
    },
    compare: {
        chart:[],
        report:{
            rows:[],
            total: ""
        }
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
        case COMPARE_DATA:
            return {
                ...state,
                compare: payload.compare
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
