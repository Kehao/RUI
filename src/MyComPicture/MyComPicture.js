import PropTypes from 'prop-types';
import React, { Component } from 'react';
import domToImage from 'dom-to-image';
import './index.less';
import { debounce } from '../utils/common';

export default class MyComPicture extends Component {
  constructor(props) {
    super(props);
    this.downloadPicture = debounce(this.downloadPicture, 800); // 防抖
    MyComPicture.downloadPicture = this.downloadPicture.bind(this); // 抛出方法最重要的一步！！
  }

  static propTypes = {
    content: PropTypes.func
  }
  // 图片下载方法
  downloadPicture = (pictureName = '图片.png', scale = 1) => {
    const filter = nodeObj => (nodeObj.tagName !== 'i');
    const result = document.getElementById('resultCanvas');
    const showCanvas = document.getElementById('showCanvas');
    // 转svg下载
    domToImage.toSvg(result, { filter })
      .then(dataUrl => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = dataUrl; // 给图片对象写入base64编码的svg流
        image.setAttribute('id', 'codeCanvas');
        showCanvas.style.display = 'none'; // 原模块处理
        result.appendChild(image);
        // 等待image dom生成
        setTimeout(() => {
          const node = document.getElementById('codeCanvas');
          const nodeWidth = node.offsetWidth;
          const nodeHeight = node.offsetHeight;
          // 生成画布
          const canvas = document.createElement('canvas');
          canvas.width = nodeWidth * scale;
          canvas.height = nodeHeight * scale;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, nodeWidth, nodeHeight, 0, 0, nodeWidth * scale, nodeHeight * scale);
          canvas.getContext('2d').scale(scale, scale);
          // 模拟a标签下载
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = pictureName;
          a.click();
          // 回收销毁
          a.remove();
          node.remove();
          showCanvas.style.display = 'block';
        }, 10)
      });
  };
  render() {
    const { content, ...args } = this.props;
    return (
      <div>
        <div id="resultCanvas" className="resultCanvas" {...args}>
          <div id="showCanvas" className="showCanvas">
            {content()}
          </div>
        </div>
      </div>
    );
  }
}
