## MyViewer 图片预览

### 基础用法

MyViewer 在社区viewerjs基础上封装成React组件

:::demo 


```js
constructor(props) {
  super(props);

  this.state = {
    previewVisible: false,
    imgList: [
      'https://biosan-saas.oss-cn-beijing.aliyuncs.com/onesFrontEnd/vue01.jpeg',
      'https://biosan-saas.oss-cn-beijing.aliyuncs.com/onesFrontEnd/vue02.png'
    ],
    legendList: [
      'https://biosan-saas.oss-cn-beijing.aliyuncs.com/onesFrontEnd/vue01.jpeg',
      'https://biosan-saas.oss-cn-beijing.aliyuncs.com/onesFrontEnd/vue02.png'
    ],
  };
}
show = (img) => {
  this.setState({previewVisible: true, imgList: [img]});
}
renderLegends = () => {
  const lis = this.state.legendList.map(img => {
    return <li onClick={() => this.show(img)} key={img}><img src={img}/></li>;
  });
  return <ul className="lengend--container">{lis}</ul>;
}
render() {
    const { previewVisible, fileList } = this.state;
    const TabPane = Tabs.TabPane;
    const RenderWarp = ({children}) => {
          return (<div className="myViewer-container">
                        <div className="myViewer-warp">
                        {children}
                  </div>
                  </div>)
          }
    return (
        <div className="clearfix">
          <Tabs defaultActiveKey="1">
            <TabPane tab="模式 1" key="1">
              <RenderWarp>
                  <MyViewer options={{inline: true, backdrop: true, button: true, hide: () => {
                    console.log('hide')
                    }}} fileList={this.state.legendList}/>
              </RenderWarp>
            </TabPane>
            <TabPane tab="模式 2" key="2">
              <RenderWarp>
                {this.renderLegends()}
                <MyViewer options={{inline: false, backdrop: true, button: true, hide: () => {
                    console.log('hide')
                    }}} fileList={this.state.imgList} visible={this.state.previewVisible} onClose={() => {this.setState({previewVisible: false})}}/>
              </RenderWarp>
            </TabPane>
          </Tabs>
        </div>
    );
}
```
:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| options | 同viewerjs的配置项| object   | —                         | —           |
| fileList | 预览的图片地址                            | 字符串 或 字符串数组   | — | — |
| visible | inline为false时候控制组件show/hide | —   | — | — |
| onClose | 关闭全屏显示回调 | function   | — | — |
