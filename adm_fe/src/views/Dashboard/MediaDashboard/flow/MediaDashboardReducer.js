import {
    USERINFO_INIT,
    TIME_SET,
    COVERVIEW_SET_CURRENT,
    COVERVIEW_SET_COMPARE,
    LINECHART_CURRENT_SET,
    LINECHART_COMPARE_SET,
    MEDIA_INCOMEREPORT_SET,
    SLOT_INCOMEREPORT_SET,
    TEMPLATE_INCOME_SET,
    TEMPLATE_CTR_SET,
} from './MediaDashboardConstants';

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
    income: {
        mediaIncome: [],
        slotIncome: []
    },
    template: {
        templateIncome: [],
        templateCtr: []
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
        case MEDIA_INCOMEREPORT_SET:
            return {
                // 媒体收入
                ...state,
                income: {
                    ...state.income,
                    mediaIncome: payload.mediaIncome
                }
            };
        case SLOT_INCOMEREPORT_SET:
            return {
                // 广告主收入
                ...state,
                income: {
                    ...state.income,
                    slotIncome: payload.slotIncome
                }
            };
        case TEMPLATE_INCOME_SET:
            return {
                // 样式收入排行
                ...state,
                template: {
                    ...state.template,
                    templateIncome: payload.templateIncome
                }
            };
        case TEMPLATE_CTR_SET:

            return {
                // 样式点击率排行
                ...state,
                template: {
                    ...state.template,
                    templateCtr: payload.templateCtr
                }
            };
        default:
            return {...state}
    }
}
