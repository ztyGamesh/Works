/**
 * authority: 0-管理员 1-媒体 2-广告主 3-底价管理员 4-审核管理员
 * */
import {isUrl} from '../utils/utils';

const menuData = [
    {
        name: '数据概览',
        icon: 'dashboard',
        path: 'dashboard',
        authority: [0, 1, 2],
        children: [{
            name: '整体数据',
            path: 'mediaDashboard',
            authority: [1],
        }, {
            name: '整体数据',
            path: 'clientDashboard',
            authority: [2],
        }, {
            name: '内容合作数据',
            path: 'contentDashboard',
            authority: [0],
        }]
    },
    {
        name: '媒体管理',
        icon: 'setting',
        path: 'media',
        authority: [0, 1],
        children: [{
            name: '媒体列表',
            path: 'media',
            authority: [0, 1],
        }, {
            name: '广告位配置',
            path: 'slot',
            authority: [0, 1],
        }, {
            name: '内容合作',
            path: 'cooperate',
            authority: [0],
        }, {
            name: '广告位价格调整',
            path: 'price',
            authority: [0],
        }]
    }, {
        name: '推广管理',
        icon: 'setting',
        path: 'promotion',
        authority: [2],
        children: [{
            name: '广告组',
            path: 'group',
            authority: [2],
        }, {
            name: '广告计划',
            path: 'plan',
            authority: [2],
        }, {
            name: '广告创意',
            path: 'creative',
            authority: [2],
        }]
    }, {
        name: '权限管理',
        icon: 'team',
        path: 'rights',
        authority: [0],
        children: [{
            name: '媒体账户',
            path: 'publisher',
            authority: [0],
        }, {
            name: '广告主账户',
            path: 'ads',
            authority: [0],
        }]
    }, {
        name: '审核管理',
        icon: 'check-circle',
        path: 'audit',
        authority: [ 4],
        children: [{
            name: '创意审核',
            path: 'creative',
            authority: [4],
        }, {
            name: '关键词审核',
            path: 'keyword',
            authority: [4],
        }]
    }, {
        name: '数据报表',
        icon: 'table',
        path: 'report',
        authority: [1, 2],
        children: [{
            name: '账户报表',
            path: 'account',
            authority: [1],
        }, {
            name: '媒体报表',
            path: 'media',
            authority: [1],
        }, {
            name: '广告位报表',
            path: 'slot',
            authority: [1],
        }, {
            name: '样式报表',
            path: 'template',
            authority: [1],
        }, {
            name: '账户报表',
            path: 'ads',
            authority: [2],
        }, {
            name: '推广组报表',
            path: 'group',
            authority: [2],
        }, {
            name: '推广计划报表',
            path: 'plan',
            authority: [2],
        }, {
            name: '推广创意报表',
            path: 'creative',
            authority: [2],
        }, {
            name: '关键词报表',
            path: 'keyword',
            authority: [2],
        }, {
            name: '地域报表',
            path: 'region',
            authority: [2],
        }, {
            name: "搜索词报表",
            path: 'search',
            authority: [2]
        }]
    }, {
        name: '财务',
        icon: 'pay-circle',
        path: 'charge',
        authority: [0, 1, 2],
        children: [{
            name: '财务',
            path: 'withdraw',
            authority: [0, 1],
        }, {
            name: '充值记录',
            path: 'record',
            authority: [0, 2],
        }, {
            name: '媒体提现',
            path: 'confirmCharge',
            authority: [0],
        }]
    }, {
        name: '账户',
        icon: 'user',
        path: 'account',
        authority: [1],
        children: [{
            name: '账户信息',
            path: 'mediaAccount',
            authority: [1],
        }]
    }, 
    // {
    //     name: '工具箱',
    //     icon: 'tool',
    //     path: 'tools',
    //     authority: [0, 2],
    //     children: [{
    //         name: '关键词上传',
    //         path: 'keywordsUpload',
    //         authority: [0, 2],
    //     }, {
    //         name: '流量预估',
    //         path: 'trafficForecast',
    //         authority: [0, 2],
    //     }, {
    //         name: '扩词工具',
    //         path: 'wordExpandingTool',
    //         authority: [0, 2],
    //     }]
    // }, 
    {
        name: '价格管理',
        icon: 'bank',
        path: 'price',
        authority: [3],
        children: [{
            name: '底价设定页',
            path: 'basePrice',
            authority: [3],
        }, {
            name: '底价设定成功页',
            path: 'basePriceSuccess',
            authority: [3],
        }, {
            name: '底价设定失败页',
            path: 'basePriceFail',
            authority: [3],
        }]
    }];

function formatter(data, parentPath = '/', parentAuthority) {
    return data.map((item) => {
        let {path} = item;
        if (!isUrl(path)) {
            path = parentPath + item.path;
        }
        const result = {
            ...item,
            path,
            authority: item.authority || parentAuthority,
        };
        if (item.children) {
            result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
        }
        return result;
    });
}

export const getMenuData = () => formatter(menuData);
