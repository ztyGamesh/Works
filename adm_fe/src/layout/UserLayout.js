import React from 'react'
import {checkRole} from '../utils/utils';

import DocumentTitle from 'react-document-title'
import Login from '../views/User/Login'
import styles from './UserLayout.less'

export default class UserLayout extends React.PureComponent {
    getPageTitle() {
        const role = checkRole();
        switch (role) {
            case 'publisher':
                return '瞬知™媒体变现系统';
            case 'ads':
                return '瞬知™投放管理系统';
            default:
                return '瞬知™广告系统';
        }
    }

    render() {
        return (
            <DocumentTitle title={this.getPageTitle()}>
                <div className={styles.bg}>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <Login />
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}