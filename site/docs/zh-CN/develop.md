# BioSan React ui组件库

> 本组件库是公司业务组件库，对于一些公用组件进行抽离，基于**ant design**基础组件开发

[gitLab地址](https://git.biosan.cn/FD/BiosanUi)

## 推荐开发环境


*   node: ^10.15.3

*   react: ^16.8.0
    
*   antd: ^3.19.8

## 命令行

```bash
# 启动开发服务器
$ npm run start

# 单元测试
$ npm run test

# 生成demo站点
$ npm run build

# 生成发布包
$ npm run libs
```
## 项目结构

```bash
biosanUi/
├── /dist/            # 输出目录
│ ├── /npm/           # 输出编译后文件
│ ├── /site/          # 输出内网demo站点
│   ├── /docs/
│      ├── /zh-CN/
│         ├── xx.md   # demo展示页面组件
│   ├── /pages/       # demo页面每个组件入口
│   ├── /styles/      # demo站点样式表
│   ├── index.html    # demo站点模版
│   ├── index.jsx     # demo站点入口文件
├── /build/           # 构建文件
├── /libs/            # 组件库共有方法、组件等
├── /src/             # 源码目录
│ ├── /button/        # 组件源文件目录
│    ├── /style/      # 组件样式表
│    ├── /_test_/     # 单元测试
│    ├── /local/      # 本地化
├── /tests/           # 测试目录
├── package.json      # 项目信息
├── .gitignore        # git过滤配置
├── .babelrc          # Babel配置
├── .npmignore        # npm过滤配置
└── .eslintrc         # Eslint配置
```
## git flow

> 在master上拉一个分支开发对应的组件，例如：feat-ossUpload, 开发完成后找同事帮你review，然后找麦飞帮你合并到master

## 组件开发步骤

1. 在src/下新建组件目录，例如example，**index.js**仅导出该组件不写业务代码，该组件引用的样式表写在该目录下**style/index.less**

2. 在**src/index.js**导出该组件

3. 接下来在demo站点上提供一个可以交互的例子，并注明该组件对外暴露的属性、方法

4. 在**/site/docs/zh-CN**下新建example.md,以写markdown的方式编辑demo组件,并在最后声明该组件的属性、方法

5. 在**/site/pages**下新建目录example提供demo组件的入口、该demo引用的样式表命名为 **style.scss**

6. 在**/site/pages/index.js**中引用demo组件入口（即**/site/pages/example/index.js**）

## 发布demo

本地打包后上传到gitlab, 在[jenkens](http://172.16.0.96:8888/jenkins/job/quickBiosanUi/)上部署。

> Jenkens上部署点击 Build with Parameters 选择所需要部署的分支。注：部署前必须找同事review代码，保证代码质量

## 发布npm 包

npm publish

> npm包统一发布找麦飞或行一
