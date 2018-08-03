import {
    USERINFO_INIT,
    LINECHART_CURRENT_SET,
} from './AccountReportConstants';

const initState = {
    // LineChart的数据
    lineChart: {
        current: []
    }

};

export default function depositoryReducers(state = initState, action) {
    const {type, payload} = action;
    switch (type) {
        case USERINFO_INIT:
            return initState;
        case LINECHART_CURRENT_SET:
            return {
                // 用户选中时间数据 为折线图做数据结构处理
                ...state,
                lineChart: {
                    ...state.lineChart,
                    current: payload.current
                }
            };
        default:
            return {...state}
    }
}
