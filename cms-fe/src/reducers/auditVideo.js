// 保存标题
const SAVE_TITLE = 'AUDITVIDEO_SAVE_TITLE';
// 保存马甲名
const SAVE_MASKMAN = 'AUDITVIDEO_SAVE_MASKMAN';
// 保存封面图 图片
const SAVE_DISPLAYINFO = 'AUDITVIDEO_SAVE_DISPLAYINFO';
// 保存分类 code
const SAVE_CATEGORY = 'AUDITVIDEO_SAVE_CATEGORY';
// 保存标签
const SAVE_TAGS = 'AUDITVIDEO_SAVE_TAGS';
// 保存用户选中的关键字
const SAVE_MACHINETAG = 'AUDITVIDEO_SAVE_MACHINETAG';
// 保存用户提取的内容类型
const SAVE_TYPE = 'AUDITVIDEO_SAVE_TYPE';
// 保存评级
const SAVE_SCORE = 'AUDITVIDEO_SAVE_SCORE';
// 保存推荐平台
const SAVE_CHANNEL = 'AUDITVIDEO_SAVE_CHANNEL';
// 保存视频-商品信息
const SAVE_VIDEO = 'AUDITVIDEO_SAVE_VIDEO';
// 初始化数据
const INIT_DATA = 'AUDITVIDEO_INIT_DATA';
// 清空还原redux初始数据
const CLEAR_DATA = "AUDITVIDEO_CLEAR_DATA";
const initialState = {
	uid: '',//uid
	title: '', //文章标题
	marksman: 0, //文章马甲名
	editorContent: 'placeHolder', //编辑产出的html
	displayInfo: { //封面图的数据
		content: "", //单张或三张的的json格式字符串
		type: 1,//封面图的展示类型 1代表 大图+标题 2代表 图文 3代表 组图
	},
    content:JSON.stringify([{
        vedio: null,
        goodsPromotion: [
            {
                uid: '',
                pic: '',
                title: '',
                price: '',
                smallImages: [],
                url: ''
            }
        ]
    }]), //爬下来的视频url
	category: '', //分类的code
	tags: '', //用户自己输入的标签
	score: 100,//用户的评分
	channel: '',//用户选中的推荐平台 code
	machineTag: '', //用户选中的关键字 code
	type: 3, //提取的内容类型 pic:1 pics:2 vedio:3
    goods: [] //对应视频的商品信息
};

const auditVideo = (state = initialState, action) => {
	switch (action.type) {
		case SAVE_TITLE:
			return {
				...state,
				title: action.title
			};
		case SAVE_MASKMAN:
			return {
				...state,
				marksman: action.marksman
			};
		case SAVE_CATEGORY:
			return {
				...state,
				category: action.category
			};
		case SAVE_TAGS:
			return {
				...state,
				tags: action.tags
			};
		case SAVE_SCORE:
			return {
				...state,
				score: action.score
			};
		case SAVE_CHANNEL:
			return {
				...state,
				channel: action.channel
			};
		case SAVE_MACHINETAG:
			return {
				...state,
				machineTag: action.machineTag
			};
		case SAVE_TYPE:
			return {
				...state,
				type: action.type
			};
		case SAVE_DISPLAYINFO:
			return {
				...state,
				displayInfo: {
					...state.displayInfo,
					type: action.displayInfoContent.type || state.displayInfo.type,
					content: action.displayInfoContent.content || '',
					//   count: action.displayInfoContent.count || state.displayInfo.count
				}
			};
		case SAVE_VIDEO:
			// console.log('save')
			// console.log(typeof action.content)
			// console.log({...state, content: action.content})
			return {
				...state,
				content: action.content
			}
		case INIT_DATA:
			return {
				...state,
				...action.data
			};
		case CLEAR_DATA:
			return initialState;
		default:
			return state;
	}
};

export default auditVideo;

// actions creators
export const saveTitle = (title) => {
	return {type: SAVE_TITLE, title}
};

export const saveMaskman = (marksman) => {
	return {type: SAVE_MASKMAN, marksman}
};

export const saveCategory = (category) => {
	return {type: SAVE_CATEGORY, category}
};

export const saveTags = (tags) => {
	return {type: SAVE_TAGS, tags}
};

export const saveScore = (score) => {
	return {type: SAVE_SCORE, score}
};

export const saveChannel = (channel) => {
	return {type: SAVE_CHANNEL, channel}
};

export const saveMachineTag = (machineTag) => {
	return {type: SAVE_MACHINETAG, machineTag}
};

export const saveType = (argType) => {
	return {type: SAVE_TYPE, argType}
};

export const saveDisplayInfo = (displayInfoContent) => {
	return {type: SAVE_DISPLAYINFO, displayInfoContent}
};

export const saveVedio = (content) => {
	return {type: SAVE_VIDEO, content}
}

export const INITDATA = (data) => {
	return {type: INIT_DATA, data}
};

export const CLEARDATA = () => {
	return {type: CLEAR_DATA}
};
