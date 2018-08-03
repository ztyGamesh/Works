import React from 'react'

/**
 * @method validateFieldData 校验数据，需要绑定组件this
 */
export function validateFieldData(validate) {
    return (rule, value, callback) => {
        if (typeof validate === 'function') {
            const msg = validate(value)
            if (msg === true || msg === '' || msg === undefined) {
                callback()
            } else {
                callback(msg)
            }
        } else {
            callback()
        }
    }
}

/**
 * @description FormItem统一样式
 */
//附加信息样式
const extraStyle = {
    fontSize: 10,
    textAlign: 'justify',
    lineHeight: '1.5'
}

//提交行样式：偏移量为label值
const submitStyle = {
    style: {
        paddingTop: 0
    },
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 17, offset: 7 },
        md: { span: 17, offset: 7 },
        lg: { span: 13, offset: 7 }
    },
}

export {
    extraStyle,
    submitStyle
}

//表单行样式（24，19，17，17）
const defaultStyle = {
    style: {
        textAlign: 'left'
    },
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 7 },
        lg: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
        lg: { span: 10 }
    }
}

//表单行样式（24，24，23，22），无label
const defaultStyleNo = {
    style: {
        textAlign: 'left'
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 23 },
        lg: { span: 22 }
    }
}

//表单行样式（24，24，24，24），满行
const lineStyle = {
    style: {
        textAlign: 'left'
    },
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 7 },
        lg: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
        md: { span: 17 },
        lg: { span: 17 }
    }
}

//表单行样式（24，24，24，24），满行，无label
const lineStyleNo = {
    style: {
        textAlign: 'left'
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 }
    }
}

export function readStyle(label, full) {
    if (full) {//满行
        //有无label
        return label ? lineStyle : lineStyleNo
    } else {
        return label ? defaultStyle : defaultStyleNo
    }
}

/**
 * @method readLevelInfo 树结构读取子节点所有的层级信息
 * @param {Array} info 总数据
 * @param {Array} child 当前所有子节点
 * 
 * @description cascader初始化必须包含所有层级信息
 */
export function readLevelInfo(info = [], child = []) {
    if (child.length === 0) {
        return []
    }
    const data = []
    const arr = [].concat(child)
    function read(all, parents = []) {
        for (let i = 0, l = all.length; i < l; i++) {
            const { value, children = [] } = all[i]
            if (children.length === 0) {
                if (arr.includes(value)) {
                    data.push(value, ...parents)
                }
            } else {
                read(children, parents.concat(value))
            }
        }
    }
    read(info)
    return Array.from(new Set(data))
}

/**
 * @method removeLevelInfo 树结构获取所有叶子节点信息
 * @param {Array} info 总数据
 * @param {Array} values 当前所有层级信息
 * 
 * @description cascader取值时会获取所有层级信息
 */
export function removeLevelInfo(info = [], values = []) {
    if (values.length === 0) {
        return []
    }
    var data = []
    const arr = [].concat(values)
    function read(all) {
        for (let i = 0, l = all.length; i < l; i++) {
            const { value, children = [] } = all[i]
            if (children.length === 0) {
                if (arr.includes(value)) {
                    data.push(value)
                }
            } else {
                read(children)
            }
        }
    }
    read(info)
    return Array.from(new Set(data))
}

/**
 * @method updateFormState 修改状态，并更新form数据，需绑定this
 * @param {Object} view 视图数据
 * @param {Object} form 表单数据
 */
export async function updateFormState(view = {}, form = {}) {
    //先更新视图
    await this.setState(view)
    //再更新数据
    await this.props.form.setFieldsValue(form)
}