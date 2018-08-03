import {
    USERINFO_INIT,
    COVERVIEW_SET_CURRENT,
    COVERVIEW_SET_COMPARE,
    LINECHART_CURRENT_SET,
    LINECHART_COMPARE_SET,
    KEYWORD_CURRENT_SET,
    KEYWORD_COMPARE_SET,
    AD_GROUP_TOP,
    AD_PLAN_TOP,
    TIME_SET
} from './ClientDashbaordConstants';

const initState = {
    // CoverView的数据
    time: {
        current: {
            begin: "",
            end: ""
        },
        compare: {
            begin: "",
            end: ""
        }
    },
    coverview: {
        current: [],
        compare: []
    },
    adgrouptop: {
    },
    adplantop: {
    },
    wordTop: {
        current: [],
        compare: []
    },
    lineChart: {
        current: [],
        compare: []
    }

};

export default function depositoryReducers(state = initState, action) {
    const {type, payload} = action;
    switch (type) {
        case USERINFO_INIT:
            return initState;
        case TIME_SET:
            return {
                ...state,
                time: payload.time
            }
        case COVERVIEW_SET_CURRENT:
            return {
                // set COVERVIEWCURRET 日期
                ...state,
                coverview: {
                    ...state.coverview,
                    current: payload.current
                }
            };
        case COVERVIEW_SET_COMPARE:
            return {
                // set COVERVIEWCOMPARE 日期
                ...state,
                coverview: {
                    ...state.coverview,
                    compare: payload.compare
                }
            };
        case LINECHART_CURRENT_SET:
            return {
                // 用户选中时间数据 为折线图做数据结构处理
                ...state,
                lineChart: {
                    ...state.lineChart,
                    current: payload.current
                }
            };
        case LINECHART_COMPARE_SET:
            return {
                // 对比时间数据 为折线图做数据结构处理
                ...state,
                lineChart: {
                    ...state.lineChart,
                    compare: payload.compare
                }
            };
        case AD_GROUP_TOP:
            return {
                // 广告组
                ...state,
                adgrouptop: payload.adgrouptop
            };
        case AD_PLAN_TOP:
            return {
                // 广告计划
                ...state,
                adplantop: payload.adplantop
            };
        case KEYWORD_CURRENT_SET:
            return {
                ...state,
                wordTop: {
                    ...state.wordTop,
                    current: payload.current
                }
            }
        case KEYWORD_COMPARE_SET:
            return {
                ...state,
                wordTop: {
                    ...state.wordTop,
                    compare: payload.compare
                }
            }
        default:
            return {...state}
    }
}
