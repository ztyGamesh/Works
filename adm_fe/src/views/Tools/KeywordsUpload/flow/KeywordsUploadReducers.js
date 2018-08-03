/**
 * @param {Array} rows 点击流量预估时选中的关键词
 */
import {
	KEYWORDSUPLOAD_INIT,
	KEYWORDSUPLOAD_CHANGE_ROWS,
	KEYWORDSUPLOAD_CHANGE_INITED
} from './KeywordsUploadConstants'

const initState = {
	rows: [],
	inited: false
};

export default function (state = initState, action) {
	const { type, data } = action
	switch (type) {
		case KEYWORDSUPLOAD_INIT:
			return initState
		case KEYWORDSUPLOAD_CHANGE_ROWS:
			return {
				...state,
				rows: data.rows
			}
		case KEYWORDSUPLOAD_CHANGE_INITED:
			return {
				...state,
				inited: true
			}
		default:
			return { ...state }
	}
}