import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Carousel, message } from 'antd';
import { saveFileToLink } from 'web-downloadfile';
import './style/index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1530224_5ejhk1x8pi7.js'
});
const BIOSANCONFIG = 'http://172.16.0.224:8002'
// 超时判断
const Tool = {}
let COUNT = 10
Tool.sessionTimeOut = {
  logOut(xhr) {
    if (xhr && xhr.status !== 200) {
      message.error('网络错误');
      return;
    }
    const times = sessionStorage.getItem('sessionOutTimes');
    if (!times) {
      message.warning('登陆验证过期，请重新登录！');
      sessionStorage.setItem('sessionOutTimes', 1);
    }
    window.location.href = BIOSANCONFIG.returnIndex;
  }
}
Tool.beforeSend = XMLHttpRequest => {
  XMLHttpRequest.setRequestHeader('authToken', sessionStorage.getItem('sessionId'));
}

export default class ViewPic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picHover: false,
      isFold: false,
      selectedKey: 0,
      fileList: [],
      rot: 0,
      isDrag: false,
      settings: {
        pageX: '',
        pageY: ''
      },
      scale: 1
    }
  }
  static propTypes = {
    fileList: PropTypes.array,
    download: PropTypes.object,
    selectedKey: PropTypes.number,
    onChange: PropTypes.func
  }
  componentWillMount() {
    this.setState({
      fileList: this.props.fileList,
      selectedKey: this.props.selectedKey,
      download: this.props.download
    })
  }
  componentDidMount() {
    document.onmousemove = this.handleMouseMove;
    document.onmouseup = this.handleMouseUp;
    const modolWidth = document.getElementById('previewLeft').clientWidth;
    const count = parseInt(((modolWidth + 16) - (34 * 2)) / 76, 10);
    const { selectedKey } = this.state;
    const smallImgPage = parseInt(selectedKey / count, 10);
    COUNT = count
    this.getBigCalList();
    this.refs.carouselSmall.goTo(smallImgPage)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedKey: nextProps.selectedKey,
      fileList: nextProps.fileList
    }, () => {
      this.getBigCalList();
      this.refs.carouselBig.goTo(nextProps.selectedKey);
    })
  }

  getSmallCalList = () => {
    const { fileList, selectedKey } = this.state;
    const count = COUNT
    const list = [...fileList];
    const imgList = []
    for (let i = 0, j = 0; i < fileList.length; i += count, j++) {
      imgList[j] = list.splice(0, count);
    }
    return imgList.map((item, i) => (
      <div key={i} className={'small_list'}>
        {item.map((img, j) => (
          <img
            key={j}
            alt=""
            src={img.smallGraphUrl}
            className={`${'small_img'} ${selectedKey === j + (i * count) ? 'checked_img' : null}`}
            id={selectedKey === j + (i * count) ? 'checked' : ''}
            onClick={this.selectedImg.bind(this, j + (i * count))} />
        ))}
      </div>)
    )
  }
  currentImgDom = selectedKey => {
    const imgs = document.getElementsByClassName('slick-active')
    let currentImg = false
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i].childNodes[0].childNodes[0].childNodes[0]
      if (img.getAttribute('id') === `bigImg${selectedKey}`) {
        currentImg = img
      }
    }
    return currentImg
  }
  selectedImg = i => {
    this.setState({
      rot: 0,
      scale: 1
    }, () => {
      const { selectedKey, rot, scale } = this.state;
      const img = this.currentImgDom(selectedKey);
      img.style.transform = `rotate(${rot}deg) scale(${scale})`
      this.refs.carouselBig.goTo(i);
      this.props.onChange(i);
    })
  }
  handleChange = current => {
    this.props.onChange(current);
    this.refs.carouselSmall.goTo(parseInt(current / COUNT, 10));
  }

  getBigCalList = () => {
    const { fileList, selectedKey } = this.state;
    const bigList = fileList.map((file, i) => (
      <div key={i} className="big_wrap" id={`bigImg-container${i}`}>
        {
          /.pdf|.PDF/.test(file.file_name) ? <embed id={`bigImg${i}`} src={`${file.oss_path}#scrollbars=0&toolbar=0&statusbar=0`} onMouseDown={this.handleMouseDown} style={{ width: '100%', height: '100%' }} /> : <img alt="" id={`bigImg${i}`} src={file.oss_path} onMouseDown={this.handleMouseDown} style={{ width: '100%' }} />
        }
      </div>
    ))
    this.setState({ bigList }, () => {
      this.refs.carouselBig.goTo(selectedKey);
    })
  }
  handleMouseDown = e => {
    this.setState({ isDrag: true });
    const { settings, selectedKey } = this.state;
    settings.pageX = e.pageX;
    settings.pageY = e.pageY;
    settings.width = document.getElementById(`bigImg-container${selectedKey}`).offsetWidth;
    settings.height = document.getElementById(`bigImg-container${selectedKey}`).offsetHeight;
    this.setState({ settings });
  }
  handleMouseMove = e => {
    if (!this.state.isDrag) return false;
    const { settings, selectedKey } = this.state;
    const img = this.currentImgDom(selectedKey);
    const dx = e.pageX - settings.pageX;
    const dy = e.pageY - settings.pageY;
    if ((dx === 0) && (dy === 0)) return false;

    const newX = parseInt(img.style.left, 10) + dx || dx;
    const newY = parseInt(img.style.top, 10) + dy || dy;
    img.style.left = `${newX}px`;
    img.style.top = `${newY}px`;
    settings.pageX = e.pageX;
    settings.pageY = e.pageY;
    this.setState({ settings });
    return true
  }
  handleMouseUp = () => {
    this.setState({ isDrag: false });
  }
  handleFold = () => {
    const { isFold } = this.state;
    const docus = document.getElementsByClassName('big_wrap')
    for (let i = 0; i < docus.length; i++) {
      docus[i].style.height = isFold ? 464 : 552
    }
    this.setState({ isFold: !isFold })
  }
  imgToSize = size => {
    const { selectedKey, rot } = this.state;
    let { scale } = this.state;
    const img = this.currentImgDom(selectedKey);
    scale += size;
    scale = scale < 0.2 ? 0.2 : scale;
    this.setState({ scale });
    img.style.transform = `rotate(${rot * 90}deg) scale(${scale})`
  }
  handleTurnRight = () => {
    const { selectedKey, scale } = this.state;
    let { rot } = this.state;
    const img = this.currentImgDom(selectedKey);
    rot += 1;
    img.style.transform = `rotate(${rot * 90}deg) scale(${scale})`
    if (rot === 3) rot = -1;
    this.setState({ rot });
  }
  handleTurnLeft = () => {
    const { selectedKey, scale } = this.state;
    let { rot } = this.state;
    const img = this.currentImgDom(selectedKey);
    rot -= 1;
    if (rot === -1) rot = 3;
    img.style.transform = `rotate(${rot * 90}deg) scale(${scale})`
    this.setState({ rot });
  }
  createXmlHttpRequest() {
    /* eslint-disable no-undef */
    if (window.ActiveXObject) { // 如果是IE浏览器
      return new ActiveXObject('Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) { // 非IE浏览器
      return new XMLHttpRequest();
    }
    return false
  }
  getDownloadUrl = () => {
    const { fileList, selectedKey, download } = this.state;
    const url = fileList[selectedKey].oss_path;
    const fileName = fileList[selectedKey].file_name;
    if (download && download.url) {
      $.ajax({
        type: 'post',
        url: download.url,
        contentType: 'application/json;charset=utf-8;',
        data: JSON.stringify({ url, headers: { 'Context-Type': 'text/xml' } }),
        beforeSend(XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader('authToken', download.authToken);
        },
        success: data => {
          if (data.result && data.result === 'success') {
            const path = data.data.oss_path;
            /.pdf|.PDF/.test(path) ? this.handleDownloadPDF(path) : this.handleDownload(path);
          } else {
            if (data.result === 'nologin') {
              Tool.sessionTimeOut.logOut();
              return
            }
            message.error(data.reason);
          }
        },
        error(xhr) {
          Tool.sessionTimeOut.logOut(xhr);
        }
      })
    } else {
      /.pdf|.PDF/.test(fileName) ? this.handleDownloadPDF(url) : this.handleDownload(url);
    }
  }
  handleDownloadPDF = url => {
    const {
      fileList,
      selectedKey
    } = this.state;
    const fileName = fileList[selectedKey].file_name;
    saveFileToLink(url, fileName.split('.pdf')[0], 'pdf');
  }
  handleDownload = url => {
    const { fileList, selectedKey, download } = this.state;
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = download && download.url ? url : `${url}?time=${new Date().valueOf()}`;
    image.onload = () => {
      const base64 = this.getBase64Image(image);
      image.setAttribute('src', base64);
      const blob = this.convertBase64UrlToBlob(base64);
      const _a = document.createElement('a');
      _a.download = fileList[selectedKey].file_name;
      _a.href = URL.createObjectURL(blob);
      _a.click();
      image.onload = null;
    }
  }

  getBase64Image(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
    return canvas.toDataURL(`image/${ext}`);
  }

  convertBase64UrlToBlob(base64) {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
  handlePrev = () => {
    // 重置当前图片尺寸和角度
    this.setState({
      rot: 0,
      scale: 1
    }, () => {
      const { selectedKey, rot, scale } = this.state;
      const img = this.currentImgDom(selectedKey);
      if (img) {
        img.style.transform = `rotate(${rot}deg) scale(${scale})`;
        this.refs.carouselBig.prev();
      }
    })
  }
  handleNext = () => {
    // 重置当前图片尺寸和角度
    this.setState({
      rot: 0,
      scale: 1
    }, () => {
      const { selectedKey, rot, scale } = this.state;
      const img = this.currentImgDom(selectedKey);
      if (img) {
        img.style.transform = `rotate(${rot}deg) scale(${scale})`;
        this.refs.carouselBig.next();
      }
    })
  }
  render() {
    const { picHover, isFold, bigList, scale } = this.state;
    return (
      <div className={'left'} id="previewLeft">
        <div
          className={'carl_big'}
          style={{ height: isFold ? '552px' : '464px' }}
          onMouseOver={() => { this.setState({ picHover: true }) }}
          onMouseLeave={() => { this.setState({ picHover: false }) }}
        >
          <Carousel ref="carouselBig" dots={false} afterChange={this.handleChange} effect="fade">
            {bigList}
          </Carousel>
          {
            picHover
              ? [<Icon type="left" key="1" className={'anticon'} style={{ left: 0, background: 'rgba(0,0,0,.09)' }} onClick={() => { this.handlePrev() }} />,
                <Icon type="right" key="2" className={'anticon'} style={{ right: 0, background: 'rgba(0,0,0,.09)' }} onClick={() => { this.handleNext() }} />]
              : ''
          }
        </div>
        <div className={'func_bar'}>
          <span className={'icon'} onClick={this.handleFold}>
            {isFold ? <Icon type="up-circle" /> : <Icon type="down-circle" />}图片列表
          </span>|
          <span className={'size'}>
            <span className={`${'icon'} ${'icon_left'}`} onClick={this.imgToSize.bind(this, 0.2)}>+</span>
            {parseInt(scale * 100, 10)}%
            <span className={`${'icon'} ${'icon_right'}`} onClick={this.imgToSize.bind(this, -0.2)}>-</span>
          </span>|
          <span className={'turn'} style={{ padding: '0 2px 0 8px' }}>
            <IconFont type="iconzuoxuanzhuan" onClick={this.handleTurnLeft} />
            <IconFont type="iconyouxuanzhuan" onClick={this.handleTurnRight} />
          </span>|
          <span className={'icon'} onClick={this.getDownloadUrl}>
            <Icon type="download" />下载
          </span>
        </div>
        <div className={'carl_small'} style={{ visibility: isFold ? 'hidden' : 'visible' }}>
          <Carousel ref="carouselSmall" dots={false}>
            {this.getSmallCalList()}
          </Carousel>
          <span className={'span_left'}>
            <Icon type="left" onClick={() => { this.handlePrev() }} />
          </span>
          <span className={'span_right'}>
            <Icon type="right" onClick={() => { this.handleNext() }} />
          </span>
        </div>
      </div>
    )
  }
}
