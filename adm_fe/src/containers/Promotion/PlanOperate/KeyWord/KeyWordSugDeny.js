/**
 * @class 否定关键词 - 搜索广告
 */
import React from 'react'
import { FormTextarea } from '../../../../components/Form'
import styles from './style.less'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            match1: {
                field: 'denykeywordsug1',
                size: 10,
                count: true,
                countTag: '新'
            },
            match2: {
                field: 'denykeywordsug2',
                size: 10,
                count: true,
                countTag: '新'
            }
        }
    }

    render() {
        const { max1, max2 } = this.props
        return (
            <div className={styles.body}>
                <div className={styles.more}>
                    <p>注：仅对已添加的“短语精确包含”匹配方式的关键词生效</p>
                    <div style={{
                        display: 'inline-block',
                        margin: '5px 0',
                        padding: '2px 6px',
                        backgroundColor: '#1890ff',
                        color: '#fff',
                        borderRadius: 4
                    }}>精确否定</div>
                    <p>当网民的搜索词与“精确否定”完全一致时，您的推广结果不会展示；</p>
                    <p>最多200个、每个否定关键字最多20个汉字（英文、标点、数字算半个汉字）</p>
                </div>
                <FormTextarea full {...this.state.match2} {...this.props} max={max1}
                    tags={this.props.denykeywordsugTags2} />
                <div className={styles.more}>
                    <div style={{
                        display: 'inline-block',
                        margin: '5px 0',
                        padding: '2px 6px',
                        backgroundColor: '#1890ff',
                        color: '#fff',
                        borderRadius: 4
                    }}>短语精确包含否定</div>
                    <p>当网民的搜索词中完全包含否定关键词时，您的推广结果不会展示</p>
                    <p>最多200个、每个否定关键字最多20个汉字（英文和标点算半个汉字</p>
                </div>
                <FormTextarea full {...this.state.match1} {...this.props} max={max2}
                    tags={this.props.denykeywordsugTags1} />
            </div>
        )
    }
}