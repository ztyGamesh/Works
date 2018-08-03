import React, { Component } from 'react';

import AuditTable from '../../../components/CMSAuditList/AuditTable';
export default class AuditList extends Component {

  render() {
    return (
      <div>
        <AuditTable {...this.props}/>
      </div>
    );
  }
};
