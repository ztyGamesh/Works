export const MenuAuthority = [
	{
		name: '数据概览',
		url: 'MediaDashboard',
		authority: "2",
		icon: 'home',
	}, {
		name: '数据概览',
		url: 'ClientDashboard',
		authority: "0",
		icon: 'home',
	},
	{
		name: '媒体管理',
		url: 'Media',
		authority: "1",
		icon: 'bars',
		children: [
			{name: '媒介渠道', url: 'ChannelList', authority: "1",},
			{name: '媒体列表', url: 'MediaList', authority: "2",},
			{name: '广告位配置', url: 'SlotList', authority: "2",},
			{name: 'SDK下载', url: 'Download', authority: "1",},
		]
	},
	{
		name: '广告主管理',
		url: 'Client',
		authority: "2",
		icon: 'bars',
		children: [
			{name: '广告代理列表', url: 'AgencyList', authority: "2",},
			{name: '广告主列表', url: 'ClientList', authority: "2",},
		]
	}, {
		name: '推广管理',
		url: 'Promotion',
		authority: "2",
		icon: 'bars',
		children: [
			{name: '广告组', url: 'GroupList', authority: "2",},
			{name: '广告计划', url: 'PlanList', authority: "2",},
			{name: '广告创意', url: 'CreativeList', authority: "2",},
		]
	}, {
		name: '权限管理',
		url: 'Authority',
		authority: "2",
		icon: 'bars',
		children: [
			{name: '媒体账户', url: 'MediaAccountList', authority: "2",},
			{name: '广告主账户', url: 'ClientAccountList', authority: "2",},
		]
	}, {
		name: '审核管理',
		url: 'Audit',
		authority: "2",
		icon: 'bars',
		children: [
			{name: '创意审核', url: 'CreativeAuditList', authority: "2",},
		]
	}, {
		name: '数据报表',
		url: 'Report',
		authority: "2",
		icon: 'bars',
		children: [
			{name: '账户报表', url: 'ClientAccountReport', authority: "2",},
			{name: '推广组报表', url: 'GroupReport', authority: "2",},
			{name: '推广计划报表', url: 'PlanReport', authority: "2",},
			{name: '推广创意报表', url: 'CreativeReport', authority: "2",},
			{name: '关键词报表', url: 'KeywordReport', authority: "2",},
			{name: '地域报表', url: 'GeoReport', authority: "2",},
			{name: '账户报表', url: 'MediaAccountReport', authority: "2",},
			{name: '媒体报表', url: 'MediaReport', authority: "2",},
			{name: '广告位报表', url: 'SlotReport', authority: "2",},
			{name: '样式报表', url: 'TemplateReport', authority: "2",},
		]
	}, {
		name: '财务',
		url: 'Finance',
		authority: "2",
		icon: 'bars',
		children: [
			{name: '充值记录', url: 'ChargeList', authority: "2",},
			{name: '媒体体现', url: 'DrawList', authority: "2",},
			{name: '财务', url: 'FinanceList', authority: "2",},
		]
	}, {
		name: '账户',
		url: 'Account',
		authority: "2",
		icon: 'bars',
		children: [
			{name: '账户信息', url: 'AccountInfo', authority: "2",},
		]
	},
];