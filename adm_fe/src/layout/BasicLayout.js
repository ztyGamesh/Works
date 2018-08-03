import React, {Fragment} from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import DocumentTitle from 'react-document-title'
import {Layout, Icon} from 'antd';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import GlobalHeader from '../components/GlobalHeader/GlobalHeader';
import Exception404 from '../views/Exception/404';
import SiderMenu from '../components/SiderMenu';
import {getMenuData} from '../common/menu';
const {Content, Header, Footer} = Layout;
import {connect} from 'react-redux';
import {requestUserInfo, init} from '../views/UserInfo/flow/userInfoActions';
import {getAuthority} from '../utils/authority';
import {checkRole} from '../utils/utils';

import MediaDashboard from '../views/Dashboard/MediaDashboard/MediaDashboard'
import ClientDashboard from '../views/Dashboard/ClientDashboard/ClientDashboard'
import ContentDashboard from '../views/Dashboard/ContentDashboard/ContentDashboard'

import MediaList from '../views/Media/Media/List/MediaList'
import MediaOperate from '../views/Media/Media/Operate/MediaOperate'
import SlotList from '../views/Media/Slot/List/SlotList'
import SlotOperate from '../views/Media/Slot/Operate/SlotOperate'
import CooperateList from '../views/Media/Cooperate/List/CooperateList'
import AddCooperate from '../views/Media/Cooperate/Operate/AddCooperate'
import PidCooperate from '../views/Media/Cooperate/Operate/PidCooperate'


import SlotPriceList from '../views/Media/Price/List/PriceList'
import SlotPriceOperate from '../views/Media/Price/Operate/PriceOperate'

import GroupList from '../views/Promotion/Group/List/GroupList'
import GroupOperate from '../views/Promotion/Group/Operate/GroupOperate'
import PlanList from '../views/Promotion/Plan/List/PlanList'
import PlanOperate from '../views/Promotion/Plan/Operate/PlanOperate'
import CreativeList from '../views/Promotion/Creative/List/CreativeList'
import CreativeOperate from '../views/Promotion/Creative/Operate/CreativeOperate'


import AccountReport from '../views/Report/AccountReport/AccountReport'
import MediaReport from '../views/Report/MediaReport/MediaReport'
import SlotReport from '../views/Report/SlotReport/SlotReport'
import TemplateReport from '../views/Report/TemplateReport/TemplateReport'
import AdsReport from '../views/Report/AdsReport/AdsReport'
import GroupReport from '../views/Report/GroupReport/GroupReport'
import PlanReport from '../views/Report/PlanReport/PlanReport'
import CreativeReport from '../views/Report/CreativeReport/CreativeReport'
import KeywordReport from '../views/Report/KeywordReport/KeywordReport'
import RegionReport from '../views/Report/RegionReport/RegionReport'
import SearchReport from '../views/Report/SearchReport/SearchReport'


import WithdrawList from '../views/Charge/Withdraw/List/WithdrawList'
import WithdrawApply from '../views/Charge/Withdraw/Apply/WithdrawApply'
import WithdrawDetail from '../views/Charge/Withdraw/Detail/WithdrawDetail'
import RecordList from '../views/Charge/Record/List/RecordList'
import RecordAddItem from '../views/Charge/Record/Add/RecordAddItem'

import ConfirmChargeList from '../views/Charge/ConfirmCharge/List/ConfirmChargeList'
import ConfirmChargeOperate from '../views/Charge/ConfirmCharge/Operate/ConfirmChargeOperate'

import MediaAccount from '../views/Account/MediaAccount'
import PublisherList from '../views/Rights/Publisher/List/PublisherList'
import PublisherOperate from '../views/Rights/Publisher/Operate/PublisherOperate'
import AdsList from '../views/Rights/Ads/List/AdsList'
import AdsOperate from '../views/Rights/Ads/Operate/AdsOperate'

import KeywordsUpload from '../views/Tools/KeywordsUpload/KeywordsUpload'
import KeywordsUploadError from '../views/Tools/KeywordsUpload/KeywordsUploadError'
import KeywordsUploadSubmitError from '../views/Tools/KeywordsUpload/KeywordsUploadSubmitError'
import TrafficForecast from '../views/Tools/TrafficForecast/TrafficForecast'
import WordExpandingTool from '../views/Tools/WordExpandingTool/WordExpandingTool'
import BasePrice from '../views/Price/BasePrice/BasePrice'
import BasePriceSuccess from '../views/Price/BasePrice/BasePriceSuccess'
import BasePriceFail from '../views/Price/BasePrice/BasePriceFail'

import AuditCreativeList from '../views/Audit/Creative/List/AuditCreativeList'
import AuditCreativeOperate from '../views/Audit/Creative/Operate/AuditCreativeOperate'

import KeyWord from '../views/Audit/KeyWord/KeyWord'

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
    },
};


class BasicLayout extends React.PureComponent {
    // Todo:根据配置及权限动态生成menu、router
    handleMenuCollapse = (collapsed) => {
        this.props.dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    componentWillMount() {
        this.props.init();
    }

    componentDidMount() {
        // 获取基础信息
        console.log('123')
        this.props.requestUserInfo();
    }

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
        {/*Todo:修改权限-根据当前用户权限返回加载相应的路由，无权限路由不予以加载*/
        }
        const {location, history, userName, role} = this.props;
        const authority = getAuthority();
        const logo = require('../assets/logo.png');
        const layout = (
            <DocumentTitle title={this.getPageTitle()}>
                <Layout>
                    <SiderMenu
                        role={role}
                        menuData={getMenuData()}
                        location={location}
                        logo={logo}
                    />
                    <Layout>
                        <Header style={{background: '#fff', padding: 0}}>
                            <GlobalHeader userName={userName} history={history}/>
                        </Header>
                        <Content style={{height: '100%', overflow: 'initial'}}>
                            <Switch>
                                <Route path='/' exact render={()=> {
                                    switch (authority) {
                                        case '0':
                                            return (<Redirect to="/dashboard/mediaDashboard"/>);
                                        case '1':
                                            return (<Redirect to="/dashboard/mediaDashboard"/>);
                                        case '2':
                                            return (<Redirect to="/dashboard/clientDashboard"/>);
                                        case '3':
                                            return (<Redirect to="/price/basePrice"/>);
                                        case '4':
                                            return (<Redirect to="/audit/creative"/>);
                                        default:
                                            return (<Redirect to='/user/login'/>)
                                    }
                                }}/>

                                <Route path='/dashboard/mediaDashboard' component={MediaDashboard}/>
                                <Route path='/dashboard/clientDashboard' component={ClientDashboard}/>
                                <Route path='/dashboard/contentDashboard' component={ContentDashboard}/>

                                <Route path='/media/media' exact component={MediaList}/>
                                <Route path='/media/media/operate' exact component={MediaOperate}/>
                                <Route path='/media/media/operate/:id' component={MediaOperate}/>

                                <Route path='/media/slot' exact component={SlotList}/>
                                <Route path='/media/slot/operate' exact component={SlotOperate}/>
                                <Route path='/media/slot/operate/:id' component={SlotOperate}/>
                                
                                <Route path='/media/price' exact component={SlotPriceList}/>
                                <Route path='/media/price/operate/:id' component={SlotPriceOperate}/>

                                <Route path='/media/cooperate' exact component={CooperateList}/>
                                <Route path='/media/cooperate/addCooperate' exact component={AddCooperate}/>
                                <Route path='/media/cooperate/pidCooperate/:uid/:type'  component={PidCooperate}/>
                                <Route path='/media/cooperate/pidCooperate/:uid/'  component={PidCooperate}/>




                                <Route path='/promotion/group' exact component={GroupList}/>
                                <Route path='/promotion/group/operate' exact component={GroupOperate}/>
                                <Route path='/promotion/group/operate/:gid' component={GroupOperate}/>

                                <Route path='/promotion/plan' exact component={PlanList}/>
                                <Route path='/promotion/plan/operate/:gid/:pid' component={PlanOperate}/>
                                <Route path='/promotion/plan/operate/:gid' component={PlanOperate}/>
                                <Route path='/promotion/plan/:gid' component={PlanList}/>

                                <Route path='/promotion/creative' exact component={CreativeList}/>
                                <Route path='/promotion/creative/operate/:pid/:cid' component={CreativeOperate}/>
                                <Route path='/promotion/creative/operate/:pid' component={CreativeOperate}/>
                                <Route path='/promotion/creative/:pid' component={CreativeList}/>

                                <Route path='/report/account' component={AccountReport}/>
                                <Route path='/report/media' component={MediaReport}/>
                                <Route path='/report/slot' component={SlotReport}/>
                                <Route path='/report/template' component={TemplateReport}/>
                                <Route path='/report/ads' component={AdsReport}/>
                                <Route path='/report/group' component={GroupReport}/>
                                <Route path='/report/plan' component={PlanReport}/>
                                <Route path='/report/creative' component={CreativeReport}/>
                                <Route path='/report/keyword' component={KeywordReport}/>
                                <Route path='/report/region' component={RegionReport}/>
                                <Route path='/report/search' component={SearchReport}/>

                                <Route path='/charge/withdraw' exact component={WithdrawList}/>
                                <Route path='/charge/withdraw/apply' component={WithdrawApply}/>
                                <Route path='/charge/withdraw/detail/:id' component={WithdrawDetail}/>

                                <Route path='/charge/record' exact component={RecordList}/>
                                <Route path='/charge/record/add'  component={RecordAddItem}/>

                                <Route path='/charge/confirmCharge' exact component={ConfirmChargeList}/>
                                <Route path='/charge/confirmCharge/operate/:id'  component={ConfirmChargeOperate}/>



                                <Route path='/account/mediaAccount' component={MediaAccount}/>

                                <Route path='/rights/publisher' exact component={PublisherList}/>
                                <Route path='/rights/publisher/operate' exact component={PublisherOperate}/>
                                <Route path='/rights/publisher/operate/:id' component={PublisherOperate}/>

                                <Route path='/rights/ads' exact component={AdsList}/>
                                <Route path='/rights/ads/operate' exact component={AdsOperate}/>
                                <Route path='/rights/ads/operate/:id' component={AdsOperate}/>

                                <Route path='/audit/creative' exact component={AuditCreativeList}/>
                                <Route path='/audit/creative/operate/:cid' component={AuditCreativeOperate}/>

                                <Route path='/audit/keyword' exact component={KeyWord}/>

                                <Route path='/tools/keywordsUpload' exact component={KeywordsUpload}/>
                                <Route path='/tools/keywordsUpload/error' component={KeywordsUploadError}/>
                                <Route path='/tools/keywordsUpload/submitError' component={KeywordsUploadSubmitError}/>
                                <Route path='/tools/trafficForecast' component={TrafficForecast}/>
                                <Route path='/tools/wordExpandingTool' component={WordExpandingTool}/>

                                <Route path='/price/basePrice' exact component={BasePrice}/>
                                <Route path='/price/basePriceSuccess'  exact component={BasePriceSuccess}/>
                                <Route path='/price/basePriceSuccess/:id'  component={BasePriceSuccess}/>
                                <Route path='/price/basePriceFail'  exact component={BasePriceFail}/>
                                <Route path='/price/basePriceFail/:id'   component={BasePriceFail}/>

                                <Route render={Exception404}/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            <Fragment>
                                Copyright <Icon type="copyright"/> 2016 Deepleaper 北京跃盟科技有限公司
                            </Fragment>
                        </Footer>
                    </Layout>
                </Layout>
            </DocumentTitle>
        );

        return (
            <ContainerQuery query={query}>
                {params => <div className={classNames(params)}>{layout}</div>}
            </ContainerQuery>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userName: state.user.userName,
        uid: state.user.uid,
        role: state.user.role
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        requestUserInfo: () => {
            dispatch(requestUserInfo())
        },
        init: () => {
            dispatch(init())
        }
    }
};
const BasicLayoutContainer = connect(mapStateToProps, mapDispatchToProps)(BasicLayout);
export default BasicLayoutContainer;
