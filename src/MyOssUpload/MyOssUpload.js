
import { Spin, Upload } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import request from '../utils/request/index';
import './index.less';

const uuidv1 = require('uuid/v1');

export default class OssUpload extends React.Component {
  constructor() {
    super();
    this.state = {
      waitUploadFilelist: [],
      isUploading: false
    };
    this.uploadRequest = this.uploadRequest.bind(this);
  }
  static propTypes = {
    batchComplete: PropTypes.func,
    beforeUpload: PropTypes.func,
    action: PropTypes.string,
    data: PropTypes.object,
    taskTimeout: PropTypes.number
  }
  static defaultProps = {
    /**
       * 批次上传完成回调
       * @param success resolveQueue
       * @param fail rejectQueue
       */
    batchComplete: (...args) => args,
    /**
       * 单任务上传超时时间
       */
    taskTimeout: 2000
  }
  beforeUpload = (file, filelist) => {
    // 当前上传任务完成进行下一次上传
    if (this.state.isUploading) return false;
    this.setState({ waitUploadFilelist: filelist });
    let canUpload = true;
    if (this.props.beforeUpload) {
      canUpload = this.props.beforeUpload(file, filelist);
    }
    return canUpload;
  }
  uploadRequest() {
    const that = this;
    if (this.state.isUploading) return;
    const requestPromises = that.initRequest();
    that.checkTasks(requestPromises);
  }
  checkTasks = requestPromises => {
    const resolveQueue = [];
    const rejectQueue = [];
    const isComplete = () => {
      if (resolveQueue.length + rejectQueue.length === this.state.waitUploadFilelist.length) {
        this.props.batchComplete(resolveQueue, rejectQueue);
        this.setState({ isUploading: false });
      }
    };
    return requestPromises.forEach((requestTask, index) => {
      const uploadFile = this.state.waitUploadFilelist[index];
      requestTask.then(() => {
        resolveQueue.push(uploadFile);
        isComplete();
      }).catch(() => {
        rejectQueue.push(uploadFile);
        isComplete();
      });
    });
  }
  initRequest = () => {
    const { action, data = {} } = this.props;
    this.setState({ isUploading: true });
    return this.state.waitUploadFilelist.map(file => {
      const key = `${data.ossSubdirectory}${uuidv1()}_${file.name}`;
      // eslint-disable-next-line no-param-reassign
      file.key = key;
      return request({ url: action, method: 'post', timeout: this.props.taskTimeout, contentType: 'FORMDATA', params: { ...data, key, file } });
    });
  }
  render() {
    const { beforeUpload, batchComplete, ...restProps } = this.props;
    return (<Spin spinning={this.state.isUploading}>
      <Upload
        {...restProps}
        beforeUpload={this.beforeUpload}
        customRequest={this.uploadRequest}
      >
        {this.props.children || null}

      </Upload>
    </Spin>);
  }
}
