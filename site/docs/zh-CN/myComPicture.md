## MyComPicture 图片下载（html页面转换成图片）

### 基础用法

MyComPicture 在社区dom-to-image基础上封装成React组件
>注：阿里云图片出现跨域问题需在服务器设置（Access-Control-Allow-Origin: *）

:::demo 


```js
contentDemo = () => (
    <div>
      <div>这是一个标题</div>
      <img
          style={{width: '100%'}}
          crossOrigin = "anonymous" // 前端跨域配置
          src="https://biosan-saas.oss-cn-beijing.aliyuncs.com/qrcode/014729acbe599d4fcdbc90d9f313e10b3d.png"
          />
      <div>这是底部title</div>
    </div>
  );
render() {
    return (
        <div className="clearfix">
          <MyComPicture
            style={{ width: '20rem', height: '26rem', backgroundColor: '#FFF' }}
            content={this.contentDemo}
          />
          <Button type='primary' onClick={() => MyComPicture.downloadPicture('demo.png', 2)}>下载demo</Button>
        </div>
    );
}
```
:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| content     | html元素                                | func   | — | —           |


### downloadPicture对外方法说明
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| downloadPicture | comPicture组件下载图片方法            | Function(name, scale)   | - | - |

### downloadPicture参数说明
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| pictureName | 下载图片名字    | String                  | - | - |
| scale       | 图片质量系数    | number                  | - | - |
