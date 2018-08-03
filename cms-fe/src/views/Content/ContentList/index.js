import React, { Component } from 'react';
import ContentTable from '../../../components/CMSContentList/ContentTable';


class ContentList extends Component {
  render() {
    return (
      <div>
        <ContentTable {...this.props}/>
      </div>
    );
  }
};

export default ContentList;
