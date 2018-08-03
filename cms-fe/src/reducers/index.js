import {combineReducers} from 'redux';

import composeAdd from './composeAdd';
import composePic from './composePic';
import composeAudit from './composeAudit';
import composeSecondCreation from './composeSecondCreation';
import goodsImport from './goodsImport';
import auditPic from './auditPic';
import auditVideo from './auditVideo';

import testReducer from './testReducer';

const reducers = combineReducers({
	composeAdd,
	composeAudit,
	composePic,
    composeSecondCreation,
	goodsImport,
	auditPic,
	auditVideo,
	testReducer
});

export default reducers;
