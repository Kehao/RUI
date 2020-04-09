## OssUpload 图片上传

### 基础用法

OssUpload

:::demo 使用方式与upload类似


```js
constructor(props) {
  super(props);

  this.state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    policyData: null,
    extraData: {}
  };
}
getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
handleCancel = () => this.setState({ previewVisible: false });

handlePreview = async file => {
    if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
    });
};
getPolicy = async args => {
    BioSanUtils.request.axios.defaults.baseURL = 'http://172.16.0.139:8013';
    BioSanUtils.request.isSucc = resp => resp.code === 0;
    const {data = {}} = await BioSanUtils.request({
        url: '/nda/file/getPolicy',
        method: 'post',
    })
    const {policy, accessid, signature, cnamehost} = data;
    this.setState({policyData: data, cnamehost, extraData: {
        policy,
        OSSAccessKeyId: accessid,
        success_action_status: 200,
        signature,
        ossSubdirectory: 'datacenter/heart/'
    }});
}
getUrlSignature = async file => {
    const resp = await BioSanUtils.request({
        url: '/nda/file/getUrlSignature',
        method: 'post',
        params: {fileUrl: `${this.state.cnamehost}/${file.key}`}
    });
    return {
        uid: file.key,
        url: resp.data,
        status: 'done',
        name: file.name
    };
}
handleChange = ({ fileList }) => {
    // this.setState({ fileList });
}
beforeUpload = (file, filelist) => {
}
onRemove = file => {
    const remainFiles = [...this.state.fileList].filter(_ => _.uid !== file.uid);
    this.setState({fileList: remainFiles});
}
onComplete = async (successFiles, failFiles) => {
    const signatureFiles = successFiles && successFiles.map(file => this.getUrlSignature(file));
    Promise.all(signatureFiles).then(resp => {
        this.setState(preState => {
            return {
                fileList: [...preState.fileList, ...resp]
            }
        })
    }).catch(err => console.error(err))
    
}
componentDidMount() {
    // 获取policy
    this.getPolicy();
}
render() {
    const { previewVisible, previewImage, fileList, extraData } = this.state;
    const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );
    return (
        <div className="clearfix">
        <OssUpload
            action="https://biosan-production.oss-cn-beijing.aliyuncs.com/"
            listType="picture-card"
            fileList={fileList}
            data = {extraData}
            multiple={true}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.onRemove}
            beforeUpload={this.beforeUpload}
            batchComplete={this.onComplete}
        >
            {fileList.length >= 3 ? null : uploadButton}
        </OssUpload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        </div>
    );
}
```
:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| batchComplete | 每次上传结束的回调 (successFiles, failedFiles) => {}| function   | —                         | —           |
| taskTimeout | 单个上传超时时间                            | number   | — | 2000 |
| data.ossSubdirectory | 上传到oss的目录，用作拼接key值;(默认key值拼接 ossSubdirectory + key + filename)     | 必填   | — | — |
