import React, {Component} from 'react';
import {Icon} from 'antd';

/**
 * 加载中动画组件
 * */
const Loading = () => {
    return(
        <div className="Loading" style={{
            width: '100%',
            height: '100%',
            position: "fixed",
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
            backgroundColor: "#000000",
            zIndex: 9999,
            opacity: '0.5'
        }}>
            <div style={{position: 'relative', top: '50%', textAlign: 'center'}}>
                <Icon spin="true" type="loading" style={{fontSize: 40, color: '#08c'}}/>
            </div>
        </div>
    )
};
export default Loading
