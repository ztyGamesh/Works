/**
 * @class 工具箱
 */
import React from 'react'
import styles from './Tools.less'
import { Affix, Button } from 'antd'

export default class extends React.Component {
    /**
     * @method scrollView 异步加载数据后，通过触发滚动条事件更新底部工具箱状态
     */
    static scrollView = (top = 0) => {
        window.scrollTo({ top: top === 0 ? 1 : top - 1 })
        setTimeout(() => {
            window.scrollTo({ top })
        }, 16)
    }

    toWordExpandingTool = () => {
        this.props.history.push('/tools/wordExpandingTool')
    }

    toKeywordsUpload = () => {
        this.props.history.push('/tools/keywordsUpload')
    }

    toTrafficForecast = () => {
        this.props.history.push('/tools/trafficForecast')
    }

    render() {
        return (
            <Affix offsetBottom={0}>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <div className={styles.item}>
                            <Button onClick={this.toWordExpandingTool}>
                                <i className={styles.imgWordExpandingTool} />
                                扩词工具
                            </Button>
                        </div>
                        <div className={styles.item}>
                            <Button onClick={this.toKeywordsUpload}>
                                <i className={styles.imgKeywordsUpload} />
                                关键词上传
                            </Button>
                        </div>
                        <div className={styles.item}>
                            <Button onClick={this.toTrafficForecast}>
                                <i className={styles.imgTrafficForecast} />
                                流量预估
                            </Button>
                        </div>
                    </div>
                </div>
            </Affix>
        )
    }
}