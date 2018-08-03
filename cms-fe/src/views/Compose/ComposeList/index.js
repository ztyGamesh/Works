import React, { Component } from 'react';
import ComposeTable from '../../../components/CMSComposeList/ComposeTable';
import wrapWithAccessionPermission from '../../../higher-order/wrapWithAccessPermission';
import { Table, Icon } from 'antd';

class ComposeList extends Component {
  render() {
    return (
      <div>
        <ComposeTable {...this.props}/>
      </div>
    );
  }
};


ComposeList = wrapWithAccessionPermission(ComposeList)
export default ComposeList;
