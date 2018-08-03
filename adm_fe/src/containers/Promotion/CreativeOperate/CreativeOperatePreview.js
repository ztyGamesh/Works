/**
 * @class
 */
import React from 'react'
import { CODE_LIST } from '../../Media/SlotOperate/config'
import styles from './CreativeOperatePreview.less'
import { placeInsert } from './'

export default class extends React.Component {
    render() {
        const { setting = {} } = this.props
        const { template } = setting
        return (
            <div className={styles.body}>
                <div>
                    {this.renderView(template)}
                </div>
            </div>
        )
    }

    renderView = (id) => {
        const { form, index, ad_scene, promote_type, schemaList, isEdit } = this.props
        const info = form.getFieldsValue()
        const material = isEdit ? info.modify[id] : info.add[id][index]
        const { ad_source, extend_type, extend_data = {} } = info
        let { title, description, pic, pic1, pic2, pic3 } = material
        title = placeInsert(title, 'title', ad_scene, promote_type, schemaList)
        description = placeInsert(description, 'description', ad_scene, promote_type, schemaList)
        pic = placeInsert(pic, 'pic', ad_scene, promote_type, schemaList)
        pic1 = placeInsert(pic1, 'pic1', ad_scene, promote_type, schemaList)
        pic2 = placeInsert(pic2, 'pic2', ad_scene, promote_type, schemaList)
        pic3 = placeInsert(pic3, 'pic3', ad_scene, promote_type, schemaList)
        switch (id) {
            //===== 广告形式:信息流
            case CODE_LIST.flow_img://大图样式
                return <React.Fragment>
                    <Back type="picList" />
                    <Back type="picList" />
                    <Pic type="large" value={pic} height={156} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="picList" />
                    <Back type="picList" />
                </React.Fragment>
                break
            case CODE_LIST.flow_video://视频样式
                return <React.Fragment>
                    <Back type="picList" />
                    <Back type="picList" />
                    <Pic type="video" value={pic} height={156} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="picList" />
                    <Back type="picList" />
                </React.Fragment>
                break
            case CODE_LIST.flow_imgAndChar://大图＋文字样式
                return <React.Fragment>
                    <Back type="picList" />
                    <Back type="picList" />
                    <Title value={title} />
                    <Pic type="large" value={pic} height={156} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="picList" />
                    <Back type="picList" />
                </React.Fragment>
                break
            case CODE_LIST.flow_videoAndChar://视频＋文字样式
                return <React.Fragment>
                    <Back type="picList" />
                    <Back type="picList" />
                    <Title value={title} />
                    <Pic type="video" value={pic} height={156} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="picList" />
                    <Back type="picList" />
                </React.Fragment>
                break
            case CODE_LIST.flow_smallimgAndChar://图文样式
                return <React.Fragment>
                    <Back type="picList" />
                    <Back type="picList" />
                    <Layout type="line" width={78}>
                        <Pic type="small" value={pic} height={88} />
                        <Title value={title} />
                        <Description value={description} />
                        <Source value={ad_source} />
                    </Layout>
                    <Extend type={extend_type} value={extend_data} />
                    <Back type="picList" />
                    <Back type="picList" />
                </React.Fragment>
                break
            case CODE_LIST.flow_imgs://组图样式
                return <React.Fragment>
                    <Back type="picList" />
                    <Back type="picList" />
                    <Title value={title} />
                    <Pic type="pics" value={[pic1, pic2, pic3]} height={76} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="picList" />
                    <Back type="picList" />
                </React.Fragment>
                break
            case CODE_LIST.flow_char://文字链样式
                return <React.Fragment>
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Title value={title} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                </React.Fragment>
                break
            //===== 广告形式:开屏
            case CODE_LIST.tail_3_static_img://3S静图
            case CODE_LIST.tail_5_dynamic_img://5S动图
            case CODE_LIST.tail_5_video://5S视频
                return <React.Fragment>{null}</React.Fragment>
                break
            //===== 广告形式:横幅
            case CODE_LIST.banner_smallimgAndChar://图文样式
                return <React.Fragment>
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Layout type="line-end" width={78}>
                        <Pic type="small" value={pic} height={88} />
                        <Title value={title} />
                        <Description value={description} />
                        <Source value={ad_source} />
                    </Layout>
                </React.Fragment>
                break
            case CODE_LIST.banner_img://纯图样式
                return <React.Fragment>
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Back type="list" />
                    <Layout type="pic-end">
                        <Pic type="large" value={pic} height={160} />
                        <Source />
                    </Layout>
                </React.Fragment>
                break
            //===== 广告形式:插屏
            case CODE_LIST.plaque_img://纯图样式
                return <React.Fragment>
                    <Back type="picList" />
                    <Back type="picList" />
                    <Back type="picList" />
                    <Back type="picList" />
                    <Back type="picList" />
                    <Back type="picList" />
                    <Layout type="pic-center" width="90%">
                        <Pic type="large" value={pic} height={160} />
                        <Source />
                    </Layout>
                </React.Fragment>
                break
            //===== 广告形式:搜索直达
            case CODE_LIST.sug_smallimgAndChar://图文
                return <React.Fragment>
                    <Back type="search" />
                    <Layout type="line" width={40}>
                        <Pic type="small" value={pic} height={50} />
                        <Title value={title} />
                    </Layout>
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="searchList" />
                    <Back type="searchList" />
                    <Back type="searchList" />
                </React.Fragment>
                break
            case CODE_LIST.sug_char://文字链
                return <React.Fragment>
                    <Back type="search" />
                    <Title value={title} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="searchList" />
                    <Back type="searchList" />
                    <Back type="searchList" />
                </React.Fragment>
                break
            // case CODE_LIST.sug_imgs://组图
            //     return <React.Fragment>
            //         <Back type="search" />
            //         <Title value={title} />
            //         <Pic type="pics" value={[pic1, pic2, pic3]} height={76} />
            //         <Extend type={extend_type} value={extend_data} />
            //         <Source value={ad_source} />
            //         <Back type="pic" />
            //         <Back type="list" />
            //         <Back type="picList" />
            //         <Back type="list" />
            //     </React.Fragment>
            //     break
            //===== 广告形式:搜索结果页
            case CODE_LIST.res_smallimgAndChar://图文
                return <React.Fragment>
                    <Back type="search" />
                    <Title value={title} />
                    <Layout type="line" width={40}>
                        <Pic type="small" value={pic} height={50} />
                        <Description value={description} />
                    </Layout>
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="pic" />
                    <Back type="list" />
                    <Back type="picList" />
                    <Back type="list" />
                </React.Fragment>
                break
            case CODE_LIST.res_imgs://组图
                return <React.Fragment>
                    <Back type="search" />
                    <Title value={title} />
                    <Pic type="pics" value={[pic1, pic2, pic3]} height={76} />
                    <Extend type={extend_type} value={extend_data} />
                    <Source value={ad_source} />
                    <Back type="pic" />
                    <Back type="list" />
                    <Back type="picList" />
                    <Back type="list" />
                </React.Fragment>
                break
            default:
                return null
                break
        }
    }
}

/**
 * @class 背景
 */
const search = require('../../../assets/PromotionCreativePreview/search.png')
const clear = require('../../../assets/PromotionCreativePreview/clear.png')
class Back extends React.Component {
    render() {
        const { type } = this.props
        return type === 'list' ? (//文章
            <div className={styles.back}>
                <div className={styles.line}>
                    <div className={styles.item}></div>
                </div>
                <div className={styles.line}>
                    <div className={styles.half}></div>
                </div>
            </div>
        ) : type === 'pic' ? (//图片
            <div className={styles.back}>
                <div className={styles.line}>
                    <div className={styles.item} style={{ height: 160 }}></div>
                </div>
            </div>
        ) : type === 'picList' ? (//图文
            <div className={styles.back}>
                <div className={styles.line}>
                    <div className={styles.left}>
                        <div className={styles.item} style={{ height: 58 }}></div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.item}></div>
                        <div className={styles.half}></div>
                    </div>
                </div>
            </div>
        ) : type === 'search' ? (//搜索框
            <div className={styles.back}>
                <div className={styles.line}>
                    <div className={styles.search}>
                        <img className={styles.searchicon} src={search} />
                        <div className={styles.searchinput}>关键词</div>
                        <img className={styles.searchclear} src={clear} />
                    </div>
                    <div>搜索</div>
                </div>
            </div>
        ) : type === 'searchList' ? (//搜索列表
            <div className={styles.back}>
                <div className={styles.line}>
                    <div className={styles.searchline}>
                        <img className={styles.searchicon} src={search} />
                    </div>
                    <div>
                        <div className={styles.item} style={{ width: '70%' }}></div>
                    </div>
                </div>
                <div className={styles.line}>
                    <div className={styles.searchline}>
                        <img className={styles.searchicon} src={search} />
                    </div>
                    <div>
                        <div className={styles.item} style={{ width: '75%' }}></div>
                    </div>
                </div>
                <div className={styles.line}>
                    <div className={styles.searchline}>
                        <img className={styles.searchicon} src={search} />
                    </div>
                    <div>
                        <div className={styles.item} style={{ width: '65%' }}></div>
                    </div>
                </div>
            </div>
        ) : null
    }
}

/**
 * @class 创意标题
 */
class Title extends React.Component {
    render() {
        const { value } = this.props
        return (
            <div className={styles.text}>
                <div>{value}</div>
            </div>
        )
    }
}

/**
 * @class 创意描述
 */
class Description extends React.Component {
    render() {
        const { value } = this.props
        return (
            <div className={styles.text}>
                <div>{value}</div>
            </div>
        )
    }
}

/**
 * @class 附加创意
 */
class Extend extends React.Component {
    render() {
        const { type, value = {} } = this.props
        return type !== 'empty' ? (
            <div className={styles.extend}>
                <div className={styles.extendtitle}>{value.extend_title}</div>
                <div className={styles.extendbutton}>
                    <div>{value.button_text}</div>
                </div>
            </div>
        ) : null
    }
}

/**
 * @class 广告
 */
const close = require('../../../assets/PromotionCreativePreview/close.png')
class Source extends React.Component {
    render() {
        const { value = '' } = this.props
        return (
            <div className={styles.source}>
                <div className={styles.sourcebutton}>
                    <div>广告</div>
                </div>
                <div className={styles.sourcetitle}>{value}</div>
                <img className={styles.sourceclose} src={close} />
            </div>
        )
    }
}

/**
 * @class 图片
 */
const imgLarge = require('../../../assets/PromotionCreativePreview/imgLarge.png')
const imgSmall = require('../../../assets/PromotionCreativePreview/imgSmall.png')
const imgPics = require('../../../assets/PromotionCreativePreview/imgPics.png')
const imgPlay = require('../../../assets/PromotionCreativePreview/play.png')
class Pic extends React.Component {
    render() {
        const { type, value, height } = this.props
        const values = value || []
        return type === 'large' ? (//大图
            <div className={styles.img} style={{ height }}>
                <img src={value || imgLarge} />
            </div>
        ) : type === 'small' ? (//小图
            <div className={styles.img} style={{ height }}>
                <img src={value || imgSmall} />
            </div>
        ) : type === 'pics' ? (//组图
            <div className={styles.imgs} style={{ height }}>
                <img src={values[0] || imgPics} />
                <img src={values[1] || imgPics} />
                <img src={values[2] || imgPics} />
            </div>
        ) : type === 'line' ? (//横幅
            <div className={styles.img} style={{ height }}>
                <img src={value || imgLarge} />
            </div>
        ) : type === 'video' ? (
            <div className={styles.img} style={{ height }}>
                <img src={value || imgLarge} />
                <img className={styles.play} src={imgPlay} />
            </div>
        ) : null
    }
}

/**
 * @class 布局
 */
class Layout extends React.Component {
    render() {
        const { type, width, children = [] } = this.props
        return type === 'line' ? (//图文布局
            <div className={styles.layout}>
                <div style={{ width }}>
                    {
                        children[0] || null
                    }
                </div>
                <div>
                    {
                        React.Children.map(children.slice(1), child => {
                            return <div>{child}</div>
                        })
                    }
                </div>
            </div>
        ) : type === 'pic-center' ? (//大图居中
            <div className={styles.center} style={{ width }}>
                <div className={styles.position}>
                    <div style={{ padding: 3 }}>
                        {
                            React.Children.map(children.slice(1), child => {
                                return <div>{child}</div>
                            })
                        }
                    </div>
                </div>
                <div>
                    {
                        children[0] || null
                    }
                </div>
            </div>
        ) : type === 'line-end' ? (//图文末尾
            <div className={styles.end} style={{
                padding: '6px 12px',
                backgroundColor: '#fff'
            }}>
                <div className={styles.layout}>
                    <div style={{ width }}>
                        {
                            children[0] || null
                        }
                    </div>
                    <div>
                        {
                            React.Children.map(children.slice(1), child => {
                                return <div>{child}</div>
                            })
                        }
                    </div>
                </div>
            </div>
        ) : type === 'pic-end' ? (//大图末尾
            <div className={styles.end} style={{ width, bottom: -5 }}>
                <div className={styles.position}>
                    <div style={{ padding: 3 }}>
                        {
                            React.Children.map(children.slice(1), child => {
                                return <div>{child}</div>
                            })
                        }
                    </div>
                </div>
                <div>
                    {
                        children[0] || null
                    }
                </div>
            </div>
        ) : null
    }
}
