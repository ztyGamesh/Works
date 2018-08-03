/**
 * @class
 */
import React from 'react'
import { Form, Collapse } from 'antd'
import { FormModal } from '../../../components/Form'

class Comp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            existed_words: [],
            new_words: []
        }
    }

    openHandle = async () => {
        const { receiveData } = this.props
        if (typeof receiveData === 'function') {
            const data = await receiveData()
            const key = + new Date() + '_'
            if (data !== false) {
                this.setState({
                    existed_words: (data.existed_words || []).map((t, i) => ({
                        key: key + i,
                        word: t
                    })),
                    new_words: Object.values(data.new_words).map((t, i) => ({
                        key: key + i,
                        word: t
                    }))
                })
            }
        }
    }

    render() {
        const { existed_words, new_words } = this.state
        return (
            <FormModal  {...this.props}
                modalTitle="上传信息"
                isSubmit
                space="0 24px 24px"
                onInit={this.openHandle}>
                <div style={{ textAlign: 'left' }}>
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Collapse.Panel header={`账号已有的关键词有${existed_words.length}个，点确定将进行更新添加操作`} key="1">
                            <div style={{
                                paddingLeft: 40,
                                maxHeight: 200,
                                overflow: 'auto'
                            }}>
                                {
                                    existed_words.map(t => {
                                        return <div key={t.key}>{t.word}</div>
                                    })
                                }
                            </div>
                        </Collapse.Panel>
                        <Collapse.Panel header={`新上传的关键词有${new_words.length}个，点确定将进行新建添加操作`} key="2">
                            <div style={{
                                paddingLeft: 40,
                                maxHeight: 200,
                                overflow: 'auto'
                            }}>
                                {
                                    new_words.map(t => {
                                        return <div key={t.key}>{t.word}</div>
                                    })
                                }
                            </div>
                        </Collapse.Panel>
                    </Collapse>
                </div>
            </FormModal>
        )
    }
}

export default Form.create()(Comp)

