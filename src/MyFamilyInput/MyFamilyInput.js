import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Input, Button, Select, Table } from 'antd'
import './style/index.less';
import { generatorId } from '../utils/common'

const ButtonGroup = Button.Group
class MyFamilyInput extends React.PureComponent {
  // static getDerivedStateFromProps(nextProps) {
  //   return null
  // }

  constructor(props) {
    super(props)
    let initalList = props.value
    if (!(Array.isArray(props.value) && props.value.length)) {
      initalList = [this.emptyItem()]
    }
    this.state = { list: initalList }
  }

  emptyItem = () => ({
    id: `${generatorId()}_${Date.now()}`,
    patientName: '',
    sampleType: '',
    admissionNo: '',
    remark: '',
    sex: '',
    disabled: false // 是否可修改
  })

  triggerChange = list => {
    const newList = [...list]
    const onChange = this.props.onChange
    this.setState({ list: newList })
    onChange && onChange(newList)
  }

  handleChangeInput = (type, index, e) => {
    const { list } = this.state
    if (type === 'sampleType' || type === 'sex') {
      list[index][type] = e
    } else {
      list[index][type] = e.target.value
    }
    this.triggerChange(list)
  }

  // 增加按钮
  handleIncrease = (index, type) => {
    const { list } = this.state
    const data = this.emptyItem()
    if (type === 'top') {
      list.unshift(data)
    } else {
      list.splice(list.length === 0 ? 0 : index + 1, 0, data)
    }
    this.setState({ list: [...list] })
    // this.triggerChange(list)
  }

  // 删除按钮
  handleDelete = index => {
    const { list } = this.state
    list.splice(index, 1)
    if (list.length === 0) {
      list.unshift(this.emptyItem())
    }
    this.triggerChange(list)
  }

  columns = [{
    title: '姓名',
    dataIndex: 'patientName',
    width: 160,
    render: (text, _, index) => (
      <React.Fragment>
        <div className={'validate'} />
        {
          <Input disabled={_.disabled} style={{ width: '87%' }} value={text} onChange={this.handleChangeInput.bind(this, 'patientName', index)} />
        }
      </React.Fragment>
    )
  }, {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    render: (text, _, index) => (
      <Select disabled={_.disabled} value={text} onChange={this.handleChangeInput.bind(this, 'sex', index)}>
        <Select.Option value="男">男</Select.Option>
        <Select.Option value="女">女</Select.Option>
      </Select>
    )
  }, {
    title: '样本类别',
    dataIndex: 'sampleType',
    width: 200,
    render: (text, _, index) => (<Select disabled={_.disabled} value={text} onChange={this.handleChangeInput.bind(this, 'sampleType', index)}>
      {
        this.props.sampleTypeList.map(n => (
          <Select.Option key={n.sampleTypeId} value={n.sampleType}>{n.sampleType}</Select.Option>
        ))
      }
    </Select>)
  }, {
    title: 'ID号',
    dataIndex: 'admissionNo',
    width: '120',
    render: (text, _, index) => <Input disabled={_.disabled} value={text} onChange={this.handleChangeInput.bind(this, 'admissionNo', index)} />
  }, {
    title: '备注',
    dataIndex: 'remark',
    width: '160',
    render: (text, _, index) => <Input disabled={_.disabled} value={text} onChange={this.handleChangeInput.bind(this, 'remark', index)} />
  }]

  render() {
    const { list } = this.state
    const { maxHeight } = this.props
    const props = {
      style: { overflow: 'auto' }
    }
    if (maxHeight) {
      props.style.maxHeight = maxHeight
    }
    return (<Row {...props} className={'myFamilyInput'}>
      <Col span={21}>
        <Table
          rowKey="id"
          columns={this.columns}
          size="small"
          bordered
          pagination={false}
          dataSource={list}
          scroll={{ x: 700 }}
        />
      </Col>
      <Col span={3}>
        <div className={'operation'}>
          <Button
            icon="plus"
            shape="circle"
            style={{ color: '#369EF5', float: 'left', marginLeft: '8px', fontWeight: 900 }}
            onClick={this.handleIncrease.bind(this, 0, 'top')}
          >
          </Button>
        </div>
        {
          list && list.map((n, index) => (
            <div key={index} className={'operationRow'}>
              <ButtonGroup style={{ float: 'left', marginLeft: '8px' }}>
                { !n.disabled && <Button
                  icon="minus"
                  shape="circle"
                  style={{ color: '#369EF5', fontWeight: 900 }}
                  onClick={this.handleDelete.bind(this, index)} />
                }
                <Button
                  icon="plus"
                  shape="circle"
                  style={{ color: '#369EF5', fontWeight: 900 }}
                  onClick={this.handleIncrease.bind(this, index)}
                >
                </Button>
              </ButtonGroup>
            </div>
          ))
        }
      </Col>
    </Row>)
  }
}

MyFamilyInput.defaultProps = {
  sampleTypeList: [] // { sampleTypeId: 'aa', sampleType: 'bb' }
}
MyFamilyInput.propTypes = {
  value: PropTypes.array,
  maxHeight: PropTypes.number,
  sampleTypeList: PropTypes.array,
  onChange: PropTypes.func
}
export default MyFamilyInput

