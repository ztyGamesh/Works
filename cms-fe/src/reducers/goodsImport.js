//保存上传文件
const SAVE_FILE = 'GOODSIMPORT_SAVE_FILE';
//清除上传列表
const CLEAR_FILES = 'GOODSIMPORT_CLEAR_FILE';
// 初始化数据
const INIT_DATA = 'GOODSIMPORT_INIT_DATA';
const initialState = {
    list: [],//媒体列表
    files: [],//上传文件列表
}

const GoodsImport = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_FILE:
            const files = [...state.files];
            const data = action.file;
            const file = files.filter((t) => t.pid === data.pid)[0];
            file ? (file.files = data.files) : files.push(data);
            return {
                ...state,
                files: files
            }
        case CLEAR_FILES:
            return {
                ...state,
                files: []
            }
        case INIT_DATA:
            return {
                ...state,
                ...action.initData
            }
        default:
            return state
    }
};

export default GoodsImport;

export const saveFile = (file) => {
    return {type: SAVE_FILE, file}
}

export const clearFiles = () => {
    return {type: CLEAR_FILES}
}

export const INITDATA = (initData) => {
    return {type: INIT_DATA, initData: {...initialState, ...initData}}
}