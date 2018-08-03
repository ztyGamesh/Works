/**
 * @class
 */
import React from 'react'
import { Form } from 'antd'
import { FormModal } from '../../../components/Form'
import styles from './ToolKeywordsModal.less'

class Comp extends React.Component {
    render() {
        const { success = 0, override = 0, error = 0, download = false } = this.props
        return (
            <FormModal modalTitle="上传结果" {...this.props}>
                <div className={styles.body}>
                    <div className={styles.line}>{success + override}个关键词导入成功</div>
                    {
                        error ?
                            <div className={styles.line}>
                                <div>{error}个关键词导入失败</div>
                                <a target="_blank" href={
                                    download === false ? 'javascript:;' : download
                                }>下载</a>
                                <a target="_blank" href={
                                    download === false ? 'javascript:;' : '#/tools/keywordsUpload/error'
                                }>查看</a>
                            </div>
                            : null
                    }
                </div>
            </FormModal>
        )
    }
}

export default Form.create()(Comp)

