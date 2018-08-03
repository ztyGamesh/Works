import React, { Component } from 'react';

import { SortablePane, Pane } from 'react-sortable-pane';

import {Button} from 'antd';
import {connect} from 'react-redux';
import {saveList} from '../../reducers/testReducer';
// 初始化的时候，根据reducer初始数据渲染

class CMSDragList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list:[]
        };
        this.addItem = this.addItem.bind(this);
    }

    componentWillMount() {
        console.log("test-----------A");
        console.log(this.props);
        this.setState({
            list: this.props.list
        })
    }

    componentWillReceiveProps(nextProps) {
        console.log('test------------B');
        console.log('reducer中的结果');
        console.log(nextProps.list);
    }

    addItem() {
        // this.setState({
        //     list: this.state.list.push("test")
        // })
        const newList = [].slice.call(this.state.list);
        newList.push(parseInt(Math.random() * 10000));
        this.setState({
            list: newList
        })
    }
    render () {
        return (
          <div style={{ padding: '10px' }}>
              <Button onClick = {this.addItem}>Add</Button>
              <SortablePane
                  direction="vertical"
                  margin={20}
                  dragHandleClassName="handle"
                  onResize={(e, id, panes, data) => {
                      // console.log('onResize', e, id, panes, data);
                  }}
                  onResizeStart={(e, id, panes) => {
                      // console.log('onResizeStart', e, id, panes);
                  }}
                  onResizeStop={(e, id, panes, data) => {
                      // console.log('onResizeStop', e, id, panes, data);
                  }}
                  onOrderChange={(panes, next) => {
                      // console.log('onOrderChange', panes, next);
                      console.log("当前结果", next);
                      const result = next.map((item,index) => {
                          return item.id
                      })
                      console.log("当前数组", result);
                      this.props.saveTitle(result)
                  }}
                  onDragStart={(e, id, panes) => {
                      // console.log('onDragStart', e, id, panes)
                  }}
                  onDragStop={(e, id, panes) => {
                      // console.log('onDragStop', e, id, panes)
                  }}
              >
                  {this.state.list.map((id, index) => (
                      <Pane
                          id={index}
                          key={index}
                          width="100%"
                          height={120}
                          style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: 'solid 1px #ddd',
                              background: '#f0f0f0',
                              position: 'relative',
                          }}
                      >
                          <div
                              className="handle"
                              style={{
                                  width: '10px',
                                  height: '10px',
                                  border: 'solid 1px #ccc',
                                  position: 'absolute',
                                  top: '10px',
                                  left: '10px',
                                  cursor: 'move',
                              }}
                          />
                          <p
                              style={{
                                  fontSize: '32px',
                                  fontWeight: 'bold',
                                  color: '#aaa',
                              }}
                          >
                              00{id}
                          </p>
                      </Pane>
                  ))}
              </SortablePane>
          </div>
        );
    }

};


const mapStateToProps = (state) => {
    return {
        list: state.testReducer.list
    }
}

const mapDispatchToProps =(dispatch) => {
    return {
        saveTitle: (list) => {
            dispatch(saveList(list))
        }
    }
}
const CMSDragListContainer = connect(mapStateToProps, mapDispatchToProps)(CMSDragList)
export default CMSDragListContainer;
