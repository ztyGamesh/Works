/**
 * @class 黑名单
 */
import React from 'react'
import { FormTreeDouble } from '../../../components/Form'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            label: true,
            field: 'black_industry',
            extra: '注：跃盟已为您屏蔽彩票交易、敏感医药、成人及丰胸产品、烟草制品、微信销售及微商业务推广、不正当休闲会所类广告。以及广告法禁投行业！',
            validate: (value) => {
                if (value.length === 0) {
                    return '请选择屏蔽类别'
                }
            }
        }
    }

    render() {
        return (
            <FormTreeDouble {...this.state} {...this.props} />
        )
    }
}