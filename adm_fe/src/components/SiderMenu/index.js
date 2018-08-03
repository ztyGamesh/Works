import 'rc-drawer-menu/assets/index.css';
import React from 'react';
import DrawerMenu from 'rc-drawer-menu';
import SiderMenu from './SiderMenu';

//暂不支持mobile端 此处将来处理移动/PC不同渲染逻辑
export default props => (
   <SiderMenu {...props} />
);
