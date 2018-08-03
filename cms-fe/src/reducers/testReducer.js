// 测试的reducer

// 1.测试拖拽组件
// 1.1保存拖拽数组
const SAVE_LIST = "TEST_DRAGLIST";

const initialState = {
    list: ["A", "B", "C"],//拖拽数组
}

const testReducer = (state = initialState, action) => {
    switch(action.type) {
        case SAVE_LIST:
            return {
                list: action.list
            }
        default:
            return state
    }
}

export default testReducer;

// actions creators
export const saveList = (list) => {
	return {type: SAVE_LIST, list}
};
