import React from 'react';
import {Route} from 'react-router-dom'
import {Layout} from 'antd'
import MediaDashboard from '../views/MediaDashboard';
import ClientDashboard from '../views/ClientDashboard';
import ChannelList from '../views/Media/ChannelList';
import MediaList from '../views/Media/MediaList';
import SlotList from '../views/Media/SlotList';
import Download from '../views/Media/Download';
import AgencyList from '../views/Client/AgencyList';
import ClientList from '../views/Client/ClientList';
import GroupList from '../views/Promotion/GroupList';
import PlanList from '../views/Promotion/PlanList';
import CreativeList from '../views/Promotion/CreativeList';
import MediaAccountList from '../views/Authority/MediaAccountList';
import ClientAccountList from '../views/Authority/ClientAccountList';
import CreativeAuditList from '../views/Audit/CreativeAuditList';
import ClientAccountReport from '../views/Report/ClientAccountReport';
import GroupReport from '../views/Report/GroupReport';
import PlanReport from '../views/Report/PlanReport';
import CreativeReport from '../views/Report/CreativeReport';
import KeywordReport from '../views/Report/KeywordReport';
import GeoReport from '../views/Report/GeoReport';
import MediaAccountReport from '../views/Report/MediaAccountReport';
import MediaReport from '../views/Report/MediaReport';
import SlotReport from '../views/Report/SlotReport';
import TemplateReport from '../views/Report/TemplateReport';
import ChargeList from '../views/Finance/ChargeList';
import DrawList from '../views/Finance/DrawList';
import FinanceList from '../views/Finance/FinanceList';
import AccountInfo from '../views/Account/AccountInfo';
import './content.less'
const {Content} = Layout;

export default class Contents extends React.Component {
	render() {
		return (
			<Content className="content">
				<Route path="/MediaDashboard" component={MediaDashboard}/>
				<Route path="/ClientDashboard" component={ClientDashboard}/>
				<Route path="/ChannelList" component={ChannelList}/>
				<Route path="/MediaList" component={MediaList}/>
				<Route path="/SlotList" component={SlotList}/>
				<Route path="/Download" component={Download}/>
				<Route path="/AgencyList" component={AgencyList}/>
				<Route path="/ClientList" component={ClientList}/>
				<Route path="/GroupList" component={GroupList}/>
				<Route path="/PlanList" component={PlanList}/>
				<Route path="/CreativeList" component={CreativeList}/>
				<Route path="/MediaAccountList" component={MediaAccountList}/>
				<Route path="/ClientAccountList" component={ClientAccountList}/>
				<Route path="/CreativeAuditList" component={CreativeAuditList}/>
				<Route path="/ClientAccountReport" component={ClientAccountReport}/>
				<Route path="/GroupReport" component={GroupReport}/>
				<Route path="/PlanReport" component={PlanReport}/>
				<Route path="/CreativeReport" component={CreativeReport}/>
				<Route path="/KeywordReport" component={KeywordReport}/>
				<Route path="/GeoReport" component={GeoReport}/>
				<Route path="/MediaAccountReport" component={MediaAccountReport}/>
				<Route path="/MediaReport" component={MediaReport}/>
				<Route path="/SlotReport" component={SlotReport}/>
				<Route path="/TemplateReport" component={TemplateReport}/>
				<Route path="/ChargeList" component={ChargeList}/>
				<Route path="/DrawList" component={DrawList}/>
				<Route path="/FinanceList" component={FinanceList}/>
				<Route path="/AccountInfo" component={AccountInfo}/>
			</Content>
		);
	}
}