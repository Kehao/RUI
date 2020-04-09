## MyPreview 图片预览

### 基础用法

:::demo 


```js
constructor(props) {
  super(props);

  this.state = {
    fileList: [
      {
        file_name: 'pic01.jpg',
        oss_path: 'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/pic01.jpg',
        smallGraphUrl:'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/pic01.jpg'
      },
      { 
        file_name: 'pic02.jpg',
        oss_path: 'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/pic02.jpg',
        smallGraphUrl:'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/pic02.jpg'
      },
      {
        file_name: 'pdf01.pdf',
        oss_path: 'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/pdf01.pdf',
        smallGraphUrl: 'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/pdf.png'
      },
      {
        file_name: 'pdf01.pdf',
        oss_path: 'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/02.pdf',
        smallGraphUrl: 'https://zita-project-test2.oss-cn-beijing.aliyuncs.com/pdf.png'
      }
    ],
    selectedKey: 0,
    visible: false,
    width:'60%',
    download: {}
    // download:{
    //   url: "http://172.16.0.224:8002/file/getOssUrlSignature",
    //   authToken: '908a94c9-4df5-4605-bff2-aff39cb97778'
    // }
  };
}
deleteImg = (index) => {
  this.setState(prevState => {
    prevState.fileList.splice(index, 1) 
    return {
      fileList: prevState.fileList
    }
  })
}
render() {
    const { fileList, selectedKey, visible, width, download } = this.state;
    return (
      <MyPreview
        deleteImg={(index)=>{this.deleteImg(index)}}
        width={width}
        fileList={fileList}
        download={download}/>
    );
}
```
:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| width | Modal的宽度| object   | —                         | 60%           |
| fileList | 预览的图片地址和图片名称                            | object   | — | — |
| deleteImg | 删除图片回调 | function   | — | — |
| download | 图片下载地址和条件 | object   | — | — |