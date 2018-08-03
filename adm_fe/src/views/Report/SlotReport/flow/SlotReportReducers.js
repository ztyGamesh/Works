import {
    USERINFO_INIT,
    SLOT_SET,
    SLOTCLASS_SET,
    LINECHART_CURRENT_SET,
} from './SlotReportConstants';

const initState = {
    // 广告位
    slot: {
        data: []
    },
    // 广告位类型
    slotClass: {
        data:{}
    },
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
        case SLOT_SET:
            return {
                // 广告位
                ...state,
                slot: {
                    ...state.slot,
                    data: payload.slot
                }
            }
        case SLOTCLASS_SET:
            return {
                // 广告位类型
                ...state,
                slotClass: {
                    ...state.slotClass,
                    data: payload.slotClass
                }
            };
        default:
            return {...state}
    }
}
