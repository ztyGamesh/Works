// 保存标题
const SAVE_TITLE = 'AUDITPIC_SAVE_TITLE';
// 保存马甲名
const SAVE_MASKMAN = 'AUDITPIC_SAVE_MASKMAN';
// 保存封面图 图片
const SAVE_DISPLAYINFO = 'AUDITPIC_SAVE_DISPLAYINFO';
// 保存分类 code
const SAVE_CATEGORY = 'AUDITPIC_SAVE_CATEGORY';
// 保存标签
const SAVE_TAGS = 'AUDITPIC_SAVE_TAGS';
// 保存用户选中的关键字
const SAVE_MACHINETAG = 'AUDITPIC_SAVE_MACHINETAG';
// 保存用户提取的内容类型
const SAVE_TYPE = 'AUDITPIC_SAVE_TYPE';
// 保存评级
const SAVE_SCORE = 'AUDITPIC_SAVE_SCORE';
// 保存推荐平台
const SAVE_CHANNEL = 'AUDITPIC_SAVE_CHANNEL';
// 图集新增一行
const ADD_PIC = 'AUDITPIC_ADD_PIC';
// 保存图集-图片
const SAVE_PIC = 'AUDITPIC_SAVE_PIC';
// 保存图集-描述
const SAVE_DESCRIPTION = 'AUDITPIC_SAVE_DESCRIPTION';
// 保存图集-商品
const SAVE_GOODS = 'AUDITPIC_SAVE_GOODS';
// 图集删除一行
const DELETE_PIC = 'AUDITPIC_DELETE_PIC';
// 图集下移一行
const MOVE_PIC = 'AUDITPIC_MOVE_PIC';
// 根据拖拽行为更新图集数据的顺序
const SORTDRAG_PICS = 'AUDITPIC_SORTDRAG_PIC';
// 添加多列图集
const ADDPICS_PIC = 'AUDITPIC_ADDPICS_PIC';
// 保存用户上传封面图三图的临时变量
const SAVE_PICS = 'AUDITPIC_SAVE_PICS';
// 初始化数据
const INIT_DATA = 'AUDITPIC_INIT_DATA';
// 清空还原redux初始数据
const CLEAR_DATA = "AUDITPIC_CLEAR_DATA";
const initialState = {
	uid: '',//uid
	title: '', //文章标题
	marksman: 0, //文章马甲名
	editorContent: 'placeHolder', //编辑产出的html
	content: [
		{
			pic: '',
			description: '',
			goodsPromotion: [
				// {
				// 	uid: '',
				// 	pic: '',
				// 	title: '',
				// 	price: '',
				// 	smallImages: [],
				// 	url: ''
				// }
			]
		}
	],  //图集内容
	displayInfo: { //封面图的数据
		content: "", //单张或三张的的json格式字符串
		type: 1,//封面图的展示类型 1代表 大图+标题 2代表 图文 3代表 组图
	},
	category: '', //分类的code
	tags: '', //用户自己输入的标签
	score: 100,//用户的评分
	channel: '',//用户选中的推荐平台 code
	machineTag: '', //用户选中的关键字 code
	type: 2, //提取的内容类型 pic:1 pics:2 vedio:3
	pics: [], // 作为存放三图的临时变量 下标0 1 2 分别对应三图的位置 json格式字符串
	// 拖拽结果
	newContent: ""
};

const auditPic = (state = initialState, action) => {
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
		case ADD_PIC:
			return Object.assign({}, state, {
				content: [
					...state.content,
					{
						pic: '',
						description: '',
						goodsPromotion: [
							// {
							// 	uid: '',
							// 	pic: '',
							// 	title: ''
							// }
						]
					}
				]
			});
		case ADDPICS_PIC:
			return Object.assign({}, state, {
				content: [
					...state.content,
					...action.content
				]
			})
		case SAVE_PIC:
			return Object.assign({}, state, {
				content: state.content.map((cont, index) => {
					if (index === action.index) {
						return Object.assign({}, cont, {pic: action.pic})
					}
					return cont;
				}),
				newContent: state.content.map((cont, index) => {
					if (index === action.index) {
						return Object.assign({}, cont, {pic: action.pic})
					}
					return cont;
				})
			});
		case SAVE_DESCRIPTION:
			return Object.assign({}, state, {
				content: state.content.map((cont, index) => {
					if (index === action.index) {
						return Object.assign({}, cont, {description: action.description})
					}
					return cont;
				}),
				newContent: state.content.map((cont, index) => {
					if (index === action.index) {
						return Object.assign({}, cont, {description: action.description})
					}
					return cont;
				})
			});

		case SAVE_GOODS:
			return Object.assign({}, state, {
				content: state.content.map((cont, index) => {
					if (index === action.index) {
						var goodsPromotion = [];
						goodsPromotion.push(action.goodsPromotion);
						return Object.assign({}, cont, {goodsPromotion: goodsPromotion})
					}
					return cont;
				}),
				newContent: state.content.map((cont, index) => {
					if (index === action.index) {
						var goodsPromotion = [];
						goodsPromotion.push(action.goodsPromotion);
						return Object.assign({}, cont, {goodsPromotion: goodsPromotion})
					}
				})
			});
		case DELETE_PIC:
			return Object.assign({}, state, {
				content: [...state.content.slice(0, action.index),
					...state.content.slice(action.index + 1)
				]
			});
		case MOVE_PIC:
			var newArray = state.content.slice();
			var nextEle = newArray[action.index + 1];
			if (nextEle !== undefined) {
				newArray[action.index] = state.content[action.index + 1];
				newArray[action.index + 1] = state.content[action.index];
			}
			return Object.assign({}, state, {
				content: newArray
			});
		case SORTDRAG_PICS:
			// return {
			// 	...state,
			// 	content: [
			// 		...action.content
			// 	]
			// }
			return {
				...state,
				newContent: action.content
			}
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
		case SAVE_PICS:
			return {
				pics: action.pics
			};
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

export default auditPic;

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

export const addPic = () => {
	return {type: ADD_PIC}
};

export const deletePic = (index) => {
	return {type: DELETE_PIC, index}
};

export const savePic = (index, pic) => {
	return {type: SAVE_PIC, index, pic}
};

export const saveDescription = (index, description) => {
	return {type: SAVE_DESCRIPTION, index, description}
};

export const saveGoods = (index, goodsPromotion) => {
	return {type: SAVE_GOODS, index, goodsPromotion}
};

export const movePic = (index) => {
	return {type: MOVE_PIC, index}
};

export const saveDisplayInfo = (displayInfoContent) => {
	return {type: SAVE_DISPLAYINFO, displayInfoContent}
};

export const savePics = (pics) => {
	return {type: SAVE_PICS, pics}
};

export const INITDATA = (data) => {
	return {type: INIT_DATA, data}
};

export const CLEARDATA = () => {
	return {type: CLEAR_DATA}
};

export const sortDrag = (content) => {
	return {type: SORTDRAG_PICS, content}
}
export const addPics = (content) => {
	return {type: ADDPICS_PIC, content}
};
