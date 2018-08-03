/**
 * @class 搜索词报表
 * */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loading from '../../../components/Loading/Loading';
import {Card, message, Button, Icon} from 'antd';
import Filter from '../../../containers/Report/SearchReport/Filter';
import TableForReport from '../../../containers/Report/SearchReport/TableForReport';
import TableDimension from '../../../containers/Report/SearchReport/TableDimension';
import AdsDropDown from '../../../containers/Report/SearchReport/AdsDropDown';
import Toggle from '../../../containers/Report/SearchReport/Toggle';
import RegionMap from '../../../containers/Report/SearchReport/RegionMap';
import Bars from '../../../containers/Report/SearchReport/Bars';
import moment from 'moment';
import request from '../../../utils/request';
import {BUSINESSAPIHOST} from '../../../common/env';

import {
    todaySubtract,
    addTasks,
    handleResponseError
} from '../../../utils/aboutReportUtils';
import {dateComparePeriod} from '../../../utils/aboutDashboard';
// import {georeport,currentSetData,deltaTimeSet,fetchuseradstruct,useradstructSet} from './flow/RegionReportActions.js';
import {searchColumnsUnlimited} from '../../../mock/Report/ColumnsMap';


class SearchReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sorter: {
                order: 'ascend',
                begin: todaySubtract(0),
                end: todaySubtract(0),
                match_type: "",
                field: 'imp',
                limit: 50,
                offset: 0,
            },
            // 从mock处取得账户报表页面的报表列
            columns: Object.assign([], searchColumnsUnlimited),
        };
        this.updateHandle = this.updateHandle.bind(this);
    }
    updateHandle = async (params) => {
        const {pageSize, current, filters} = params;
        const res = await request({
            url: `${BUSINESSAPIHOST}/queryreport/list`,
            method: 'get',
            data: {
                sort: params.sorter.field,
                order: params.sorter.order,
                limit: pageSize,
                offset: pageSize * (current - 1),
                begin: params.sorter.begin,
                end: params.sorter.end,
                match_type: params.sorter.match_type,
                ...filters
            }
        })
        if (res) {
            let result = res.data;
            result.rows.forEach((item, index) => {
                item.uid = index
            })
            return {
                rows: result.rows,
                total: parseInt(result.total)
            }
        }
    }
    handleUpload() {
        // 下载报表
        // queryreport/list?begin=20180701&end=20180801&offset=0&limit=100&sort=query&order=asc&match_type=1
        var url = BUSINESSAPIHOST + '/queryreport/download?offset=0&limit=100000&begin=' + this.state.sorter.begin + '&end=' + this.state.sorter.end + '&order=desc' + '&match_type=' + this.state.sorter.match_type + '&sorter=' + this.state.sorter.field;
        window.open(encodeURI(url));
    }
    dateChange(dates, dateString) {
        const condition = {
            begin: dateString[0].replace(/-/g, "/"),
            end: dateString[1].replace(/-/g, "/")
        }        
        this.setState({
            sorter: {
                ...this.state.sorter,
                begin: condition.begin,
                end: condition.end,
            }
        })
    }
    matchTypeChange(x) {
        this.setState({
            sorter: {
                ...this.state.sorter,
                match_type: x
            }
        })
    }
    render() {
        return (
            <div>
            <Card style={{
                    margin: "20px 20px 20px"
            }}>
                <Filter 
                dateChange={this.dateChange.bind(this)}
                matchTypeChange={this.matchTypeChange.bind(this)}
                />
            </Card>

            <Card title="数据报表" style={{
                    margin: "20px 20px 20px"
            }} extra={
                <Icon type="download" style={{cursor: "pointer",fontSize:"16px"}} title="下载报表" onClick={this.handleUpload.bind(this)}/>
            }>
                <TableForReport
                    columns={this.state.columns}
                    onUpdate={this.updateHandle}
                    sorter={this.state.sorter}>
                </TableForReport>
            </Card>
            </div>
        );
    }
}

export default SearchReport;
