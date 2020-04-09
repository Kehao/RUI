import PropTypes from 'prop-types';
import React from 'react';
import { Modal, Row, Col, Icon } from 'antd';
import './style/index.less';
import ViewPic from './viewPic';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1530224_5ejhk1x8pi7.js'
});

export default class MyPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      fileList: [],
      selectedKey: 0,
      width: '60%'
    }
  }
  static propTypes = {
    width: PropTypes.string,
    fileList: PropTypes.array,
    download: PropTypes.object,
    deleteImg: PropTypes.func
  }
  componentWillMount() {
    const { fileList, download } = this.props
    this.setState({
      fileList,
      download
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.fileList !== this.props.fileList) {
      this.setState({ fileList: nextProps.fileList });
    }
  }
  openModal = () => {
    this.setState({ visible: true });
  }
  hideModal= () => {
    this.setState({
      visible: false,
      selectedKey: 0
    });
  }

  changeKey = key => {
    const { fileList } = this.state;
    if (!fileList || !fileList.length) {
      return;
    }
    this.setState({ selectedKey: key });
  }
  selectedImg = index => {
    this.setState({
      selectedKey: index,
      visible: true
    })
  }
  deleteImg = index => {
    this.props.deleteImg(index)
  }
  renderImg = fileList => (fileList.map((img, index) => (
    <div className={'img_box'} key={`prev_${index}`}>
      <div className={'img_mask'}>
        <IconFont style={{ marginRight: '5px' }} type="iconyulan" onClick={() => this.selectedImg(index)} />
        <IconFont style={{ marginLeft: '5px' }} type="iconlajitong1" onClick={() => this.deleteImg(index)} />
      </div>
      <img
        alt=""
        src={img.smallGraphUrl}
        className={'img_item'}
      />
    </div>
  )))
  render() {
    const { fileList, selectedKey, download, visible } = this.state;
    return (
      <div>
        {this.renderImg(fileList)}
        <Modal
          title="图片病历"
          visible={visible }
          footer={null}
          width={this.props.width}
          className={'viewPicModal'}
          maskClosable={false}
          onCancel={this.hideModal}
          // destroyOnClose
        >
          <Row>
            <Col span={24} className={'myModal_content'}>
              <ViewPic
                fileList={fileList}
                selectedKey={selectedKey}
                onChange={this.changeKey}
                download={download}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
