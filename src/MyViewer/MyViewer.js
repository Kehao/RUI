import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.min.css';

const noop = () => {};

export default class MyViewer extends Component {
  constructor(props) {
    super(props);
    this.container = null;
    this.viewer = null;
  }
  static propTypes = {
    options: PropTypes.object,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    fileList: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }
  componentDidMount() {
    this.viewerInit();
  }
  componentDidUpdate() {
    if (!this.viewer) return;
    this.viewerInit();
  }
  componentWillUnmount() {
    if (this.viewer) this.viewer.destroy();
  }
  viewerInit() {
    if (this.viewer) this.viewer.destroy();
    const { options = {}, visible, onClose = noop } = this.props;
    const isInline = typeof options.inline === 'undefined' ? true : options.inline;
    this.viewer = new Viewer(this.container, {
      ...options
    });

    // eslint-disable-next-line func-names
    this.viewer.hide = function () {
      !isInline && onClose();
      (options.hide || noop)();
    };

    if (isInline) this.viewer.show();
    if (!isInline && visible) this.viewer.show();
  }
  renderImgs = imgs => {
    let imgList;
    if (typeof imgs === 'string') {
      imgList = [imgs];
    } else if (Array.isArray(imgs)) {
      imgList = imgs;
    } else {
      throw Error('参数filtList必须是字符串或者字符串数组！');
    }
    return imgList.map(file => <img src={file} key={file} alt="" />);
  }
  render() {
    const { fileList, ...others } = this.props;
    return (
      <div ref={container => { this.container = container; }} {...others} style={{ display: 'none' }}>
        {this.renderImgs(fileList)}
      </div>
    );
  }
}
