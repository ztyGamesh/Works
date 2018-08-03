import React, {Component} from 'react'
import {Modal, Form, Input, message} from 'antd'
const FormItem = Form.Item;
import {checkNumber} from '../../utils/utils'
/**
 * 申请试用弹层组件
 * props.visible:显示/隐藏  true/false
 * props.confirmLoading: 异步加载状态 true/false
 * props.onOk: 点击确定按钮
 * */
class FreeTrial extends Component {
    constructor() {
        super();
        this.state = {
            'company': '',
            'kind': '',
            'email': '',
            'phone': ''
        }
    }

    handleOk = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onOk(values, function () {
                    this.init();
                }.bind(this));
            } else {
                message.error('表单填写有误，请重新检查！');
            }
        });
    };
    //初始化组件
    init = ()=> {
        this.setState({
            'company': '',
            'kind': '',
            'email': '',
            'phone': ''
        },this.props.form.setFieldsValue({
            'company': '',
            'kind': '',
            'email': '',
            'phone': ''
        }));
    };
    handleCancel = () => {
        this.props.onCancle()
    };

    changeCompany = (e)=> {
        this.setState({
            company: e.target.value
        });
    };
    changeKind = (e)=> {
        this.setState({
            kind: e.target.value
        });
    };
    changeEmail = (e)=> {
        this.setState({
            email: e.target.value
        });
    };

    changePhone = (e)=> {
        this.setState({
            phone: e.target.value
        });
    };


    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };
        const {visible, confirmLoading} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal title="免费试用"
                   okText="提交"
                   cancelText="取消"
                   visible={visible}
                   onOk={this.handleOk}
                   confirmLoading={confirmLoading}
                   onCancel={this.handleCancel}
            >
                <FormItem
                    {...formItemLayout}
                    label="公司名称"
                >
                    {getFieldDecorator('company', {
                        rules: [
                            {required: true, message: '请输入公司名称！'}
                        ],
                    })(
                        <Input onChange={this.changeCompany}/>
                    )}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="公司性质"
                >
                    {getFieldDecorator('kind', {
                        rules: [
                            {required: true, message: '请输入公司性质！'}
                        ],
                    })(
                        <Input onChange={this.changeKind}/>
                    )}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="联系邮箱"
                >
                    {getFieldDecorator('email', {
                        rules: [
                            {required: true, message: '请输入联系邮箱！'},
                            {type: 'email', message: '邮箱格式不正确！'}
                        ],
                    })(
                        <Input onChange={this.changeEmail}/>
                    )}

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="联系电话"
                >
                    {getFieldDecorator('phone', {
                        rules: [
                            {required: true, message: '请输入联系电话！'},
                            {
                                validator: (rule, value, callback) => {
                                    if (!checkNumber(value)) {
                                        callback('电话号码格式错误！')
                                    }
                                    callback()
                                }
                            }
                        ],
                    })(
                        <Input onChange={this.changePhone}/>
                    )}
                </FormItem>

            </Modal>
        )
    }
}
export default Form.create()(FreeTrial);