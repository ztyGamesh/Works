import React, { Component } from 'react';
import {DP_POST, DP_taobao} from '../../utils/fetch';
import {Card, Icon, Button, message} from 'antd';
import _ from 'underscore';
class SingleCommodity extends Component {

    insertCommodity () {
        DP_taobao(this.props.data.url).then((res) => {
            if (res === "failed") {
                message.error("该商品无效")
                return
            }
            // 获取taobaoAPI返回的数据对象data
            var temp = res.tbk_item_info_get_response.results.n_tbk_item[0];
            // 给每个商品加一个唯一的标识符 添加一个 0-100W的随机数
            temp.uniqueId = _.random(1, 1000000);
            this.setState({targetData: temp})
            //  将从淘宝得到的数据对象 给到父组件 [宝贝]
            this.props.handleDataArr(this.state.targetData)

            message.success("成功插入商品，点击右下角确认可见")
        })
    }
    render() {
        return (
            <Card style={{
				width: "120px",
				float: 'left',
                margin: "0 20px 20px 0"
			}} bodyStyle={{
				padding: 6
			}}>
				<Icon onClick={() => {
                    this.props.data.deleteCommodity(this.props.data.goodsUid)
                }}type="close-square" style={{
					position: "absolute",
					right: 0,
					top: 0,
					color: "#108ee9",
					zIndex: "1000",
					backgroundColor: "white"
				}}/>
				<div className="custom-image">
					{/* 这里图片链接使用到了商品数据 后续可能还会有别的地方 */}
					<img alt="example" width="100%" height="100%" src={this.props.data.cover}/>
                    <Button onClick={this.insertCommodity.bind(this)}>插入商品</Button>
				</div>
			</Card>
        )
    }
}

class MyCommodity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commodityList: []
        };
        this.updateList = this.updateList.bind(this);
    }
    componentWillMount() {
        console.log("MyCommodity");
        this.updateList()
    }


    updateList () {
        // const url = SERVICE_API_URL + '/api/goodsLibrary/delFavorite';
        // const option = {
        //     "user_uid": JSON.parse(sessionStorage.token).user,
        //     "goods_uid": 0
        // }
        const url = SERVICE_API_URL + '/api/goodsLibrary/listFavorite';
        const option = {
            "user_uid" : JSON.parse(sessionStorage.token).user
        }
        DP_POST(url, {body:option}).then((res) => {
            if (res.status === "ok") {
                console.log(res);
                this.setState({
                    commodityList: res.data.map((item) => {
                        return {
                            goodsUid: item.goodsUid,
                            cover: item.cover,
                            title: item.title,
                            deleteCommodity: this.deleteCommodity.bind(this),
                            url: item.url
                        }
                    })
                })
            }
        })
    }

    deleteCommodity (goodsUid) {
        console.log(goodsUid);
        const url = SERVICE_API_URL + '/api/goodsLibrary/delFavorite';
        const option = {
            "user_uid": JSON.parse(sessionStorage.token).user,
            "goods_uid": goodsUid
        }
        DP_POST(url, {body: option}).then((res) => {
            if (res.status === "ok") {
                this.setState({
                    commodityList: _.filter(this.state.commodityList, function (item) {
                        return item.goodsUid !== goodsUid
                    })
                })
            }
        })
    }
    render() {
        return (
            <div>
                {
                    this.state.commodityList.map((commodity) => {
                        return <SingleCommodity data={commodity} key={commodity.goodsUid} handleDataArr={this.props.handleDataArr}/>
                    })
                }
            </div>
        );
    }
}

export default MyCommodity;
