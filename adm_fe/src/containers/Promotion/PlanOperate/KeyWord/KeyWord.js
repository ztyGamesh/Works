/**
 * @class 关键词
 */
import React from 'react'
import { Button } from 'antd'
import { FileCsv } from '../../../../components/File'
import { FormTextarea } from '../../../../components/Form'
import styles from './style.less'
import { BUSINESSAPIHOST } from '../../../../common/env'
const downloadExample = `${BUSINESSAPIHOST}/adplan/downloadWordExample`
import { getKeywordFormFiles } from './'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            field: 'keyword',
            size: 10,
            count: true,
            countTag: '新'
        }
    }

    saveKeywordHandle = (e = []) => {
        const oldValue = this.props.form.getFieldValue('keyword')
        const keyword = getKeywordFormFiles(e, oldValue, this.props.max)
        if (keyword === false) {
            return false
        }
        this.props.form.setFieldsValue({ keyword })
    }

    render() {
        return (
            <div className={styles.body}>
                <div className={styles.line}>
                    <FileCsv text="导入本地文件" onChange={this.saveKeywordHandle} fileList size={10} />
                </div>
                {/* <div className={styles.line}>
                    <Button>
                        <a target="_blank" href="#/tools/wordExpandingTool">扩词工具</a>
                    </Button>
                </div> */}
                <div className={styles.warning}>文件及格式要求：1、支持CSV文件导入；2、每个关键词一行；3、计划关键词个数上限为1000个。</div>
                <div className={styles.line}>
                    <a style={{ fontSize: 10 }} target="_blank" href={downloadExample}>点击查看文件示例</a>
                </div>
                <FormTextarea full {...this.state} {...this.props}
                    selectData={this.props.select}
                    selectText="可点击选择商品组字段"
                    tags={this.props.keywordTags} />
                <div className={styles.more}>
                    <p>关键词定向方式提示：</p>
                    <p style={{ textIndent: '2em' }}>
                        用户购买的关键词拆分词后同时出现在文章拆分的关键词中，才能进行推广；
                    </p>
                    <p style={{ textIndent: '2em' }}>
                        举例：比如用户购买了“奶油蛋糕“一个关键词，分词后为“奶油”和“蛋糕”，文章中拆分后的关键词必须同时包含“奶油”和“蛋糕”，广告才能推广。
                    </p>
                </div>
            </div>
        )
    }
}