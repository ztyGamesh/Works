# Deepleaper广告投放系统

## 前端开发

本项目分为3个小项目，根据开发的具体小项目使用不同的配置

-------------------------------------------------------------------------------

**publisher**

配置本地开发机hosts：

> 127.0.0.1   publisher-local.deepleaper.com


启动devServer：

> npm run watch

使用以下路径访问项目：

http://publisher-local.deepleaper.com:7780/

-------------------------------------------------------------------------------

**ads**

配置本地开发机hosts：

> 127.0.0.1   ads-local.deepleaper.com


启动devServer：

> npm run watch

使用以下路径访问项目：

http://ads-local.deepleaper.com:7780/

-------------------------------------------------------------------------------

**adm**

配置本地开发机hosts：

> 127.0.0.1   adm-new-local.deepleaper.com


启动devServer：

> npm run watch

使用以下路径访问项目：

http://adm-new-local.deepleaper.com:7780/

--------------------------------------------------------------------------------
**发布到研发环境**

1.在jenkins编译

http://jenkins.deepleaper.com/view/000_Build/job/adm_fe_build/

2.在jenkins发布

*publisher:*
http://jenkins.deepleaper.com/view/001_Dev_Deploy/job/dev_adm_fe-publisher_deploy/

*ads:*
http://jenkins.deepleaper.com/view/001_Dev_Deploy/job/dev_adm_fe-ads_deploy/

*adm:*
http://jenkins.deepleaper.com/view/001_Dev_Deploy/job/dev_adm_fe-adm_deploy/

--------------------------------------------------------------------------------

## 运维

**编译**

1.安装淘宝镜像源使cnpm命令生效

> npm install -g cnpm --registry=https://registry.npm.taobao.org

2.安装编译依赖包

> cnpm install

3.代码编译

> npm run build

不同环境的接口地址配置在相应服务器上，前端代码只编译一次


**发布**

1.将dist下的代码发布至服务器
