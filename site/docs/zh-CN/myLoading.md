## MyLoading 加载中组件

### 基础用法

MyLoading 可以通过配置在指定的组件内  加载，也可以挂载到 body 上，进行一个全局 loading 展示。

:::demo

```js
state = {
  globalLoading: false,
  partLoading: false
}

openLoading = (type) => {
  this.setState({
    [type]: true
  })
  setTimeout(() => {
    this.setState({
    globalLoading: false,
    partLoading: false
    })
  }, 2000)
}

render() {
  const {globalLoading, partLoading} = this.state;
    return (
        <div className="clearfix">
          <Button type="primary" onClick={() => {this.openLoading('globalLoading')}}>打开全局Loading(2s后自动关闭)</Button>
          <br />
          <br />
          <Button type="primary" onClick={() => {this.openLoading('partLoading')}}>打开局部Loading(2s后自动关闭)</Button>
          <MyLoading tip={'加载中...'} size={'large'} inner={false} loading={globalLoading}/>
          <MyLoading size={'small'} inner={true} loading={partLoading}/>
        </div>
    );
}
```

:::

### 配置参数

| 参数    | 说明                                                               | 类型    | 可选值                        | 默认值                                   |
| ------- | ------------------------------------------------------------------ | ------- | ----------------------------- | ---------------------------------------- |
| tip    | Loading 的 Spin 组件(也就是加载的图标)的文本描述                | string  | - | ‘’|
| size    | 控制 Loading 的 Spin 组件(也就是加载的图标)的大小                  | string  | `small`、 `default` 、`large` | 全局挂载默认`large`，局部挂载默认`small` |
| inner   | 控制 Loading 组件的挂载位置（为`true`挂载局部，为`false`挂载全局） | boolean | `true`、 `false`              | `false`                                  |
| loading | 控制 Loading 组件是否开启(为`true`开启，为`false`关闭)             | boolean | `true`、 `false`              | `false`                                  |
