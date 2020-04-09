## print方法 可以打印指定的react component

### 基础用法

通过传入指定的content等配置项打印对应的内容；

:::demo

```js

content1 = React.createRef();

printClick = (content) => {
    utils.print({
        content
    })
}

render() {
    return (
        <div className="clearfix">
             <Button type="primary" onClick={() => {this.printClick(this.content1.current)}}>打印</Button>
             <br />
             <br />
             <br />
            <div ref = {this.content1}>
                <div style = {{color:'red'}}>我也是要被打印的内容</div>
                <img src='https://biosan-saas.oss-cn-beijing.aliyuncs.com/onesFrontEnd/vue01.jpeg' />
            </div>
        </div>
    );
}
```

:::

### 配置参数

| 参数    | 说明                                                               | 类型    | 可选值                        | 默认值                                   |
| ------- | ------------------------------------------------------------------ | ------- | ----------------------------- | ---------------------------------------- |
| content    | 打印的内容(通过ref获取组件的实例or真实的dom节点)               | object  | - | `null` |
| onBeforePrint   | 打印前触发的回调函数 | function | -              | `null`                                 |
| onAfterPrint | 打印后触发的回调函数             | function | -              | `null`                                |
| pageStyle    | 覆盖打印window的默认样式                  | string  | - | `null` |
| bodyClass | 给打印的window 的body加上指定的类名             | string | -              | `null`                                  |
| copyStyles | 是否从parent window拷贝所有的样式tags 到print window            | boolean | `true`、 `false`              | `true`                                  |
