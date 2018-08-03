/**
 * @class 信息截图存根
 */
import React from 'react'
import { FormUpload } from '../../../components/Form'
import { BUSINESSAPIHOST } from '../../../common/env'


export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name:'file_data',
            label: '信息截图存根',
            field: 'attach',
            required: false,
            multiple: false,
            action:`${BUSINESSAPIHOST}/materiel/uploadimagewithdetail`,
            accept:'image/jpg,image/png,image/gif,image/jpeg',
            validate: (value) => {
                console.log('value',value);

            }
        }
    }

    render() {
        return (
            <FormUpload {...this.state} {...this.props} />
        )
    }
}