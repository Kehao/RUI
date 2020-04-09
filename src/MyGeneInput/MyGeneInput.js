import React from 'react';
import { Cascader, Table } from 'antd';
import PropTypes from 'prop-types'

const originOptionsA = [{
  value: '<span>αα</span>',
  label: <span>αα</span>
}, {
  value: '<span>--<sup>SEA</sup></span>',
  label: <span>--<sup>SEA</sup></span>
}, {
  value: '<span>--<sup>THAI</sup></span>',
  label: <span>--<sup>THAI</sup></span>
}, {
  value: '<span>-α<sup>3.7</sup></span>',
  label: <span>-α<sup>3.7</sup></span>
}, {
  value: '<span>-α<sup>4.2</sup></span>',
  label: <span>-α<sup>4.2</sup></span>
}, {
  value: '<span>α<sup>QS</sup>α</span>',
  label: <span>α<sup>QS</sup>α</span>
}, {
  value: '<span>α<sup>CS</sup></span>',
  label: <span>α<sup>CS</sup></span>
}, {
  value: '<span>α<sup>WS</sup>α</span>',
  label: <span>α<sup>WS</sup>α</span>
}]


const originOptionsB = [{
  value: '<span>β<sup>N</sup></span>',
  label: <span>β<sup>N</sup></span>
}, {
  value: '<span>β<sup>CD41-42</sup></span>',
  label: <span>β<sup>CD41-42</sup></span>
}, {
  value: '<span>β<sup>CD43</sup></span>',
  label: <span>β<sup>CD43</sup></span>
}, {
  value: '<span>β<sup>IVS-2-654</sup></span>',
  label: <span>β<sup>IVS-2-654</sup></span>
}, {
  value: '<span>β<sup>-28</sup></span>',
  label: <span>β<sup>-28</sup></span>
}, {
  value: '<span>β<sup>-29</sup></span>',
  label: <span>β<sup>-29</sup></span>
}, {
  value: '<span>β<sup>-30</sup></span>',
  label: <span>β<sup>-30</sup></span>
}, {
  value: '<span>β<sup>-32</sup></span>',
  label: <span>β<sup>-32</sup></span>
}, {
  value: '<span>β<sup>-CD71-72</sup></span>',
  label: <span>β<sup>-CD71-72</sup></span>
}, {
  value: '<span>β<sup>E</sup></span>',
  label: <span>β<sup>E</sup></span>
}, {
  value: '<span>β<sup>CD17</sup></span>',
  label: <span>β<sup>CD17</sup></span>
}, {
  value: '<span>β<sup>CD31</sup></span>',
  label: <span>β<sup>CD31</sup></span>
}, {
  value: '<span>β<sup>CD14-15</sup></span>',
  label: <span>β<sup>CD14-15</sup></span>
}, {
  value: '<span>β<sup>CD27-28</sup></span>',
  label: <span>β<sup>CD27-28</sup></span>
}, {
  value: '<span>β<sup>IVS-1-5</sup></span>',
  label: <span>β<sup>IVS-1-5</sup></span>
}, {
  value: '<span>β<sup>CAP+1</sup></span>',
  label: <span>β<sup>CAP+1</sup></span>
}, {
  value: '<span>β<sup>IntM</sup></span>',
  label: <span>β<sup>IntM</sup></span>
}]


class MyGeneInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleDisplayShowagen = (_, selectedOptions) => <React.Fragment>{originOptionsA.find(_A => _A.value === selectedOptions[0].value).label} / {originOptionsA.find(_A => _A.value === selectedOptions[1].value).label}</React.Fragment>

  handleDisplayShowbgen = (_, selectedOptions) => {
    if (selectedOptions.length > 0) {
      return <React.Fragment>{originOptionsB.find(_B => _B.value === selectedOptions[0].value).label} / {originOptionsB.find(_B => _B.value === selectedOptions[1].value).label}</React.Fragment>
    }
    return null
  }

  optionagen = originOptionsA.map(item => ({
    ...item,
    children: originOptionsA
  }))
  optionbgen = originOptionsB.map(item => ({
    ...item,
    children: originOptionsB
  }))

  render() {
    const { tableOption, dataSource, ...restProps } = this.props

    const columns = tableOption.map(_n => ({
      title: _n.title,
      dataIndex: _n.dataIndex,
      width: _n.width,
      render: (text, record, index) => {
        const displayRender = _n.options ? (_, selectedOptions) => <React.Fragment>{_n.options.find(_B => _B.value === selectedOptions[0].value).label} / {_n.options.find(_B => _B.value === selectedOptions[1].value).label}</React.Fragment> : this[`handleDisplayShow${_n.dataIndex}`]
        const options = _n.options ? _n.options : this[`option${_n.dataIndex}`]
        return <Cascader allowClear={_n.allowClear} displayRender={displayRender} value={text} options={options} onChange={e => this.props.onSelectChange(_n.dataIndex, index, e)} placeholder={_n.placeholder} />
      }
    }))
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        size="small"
        pagination={false}
        {...restProps}
      />
    )
  }
}
MyGeneInput.defaultProps = {
  tableOption: [],
  dataSource: []
}

MyGeneInput.propTypes = {
  tableOption: PropTypes.array,
  dataSource: PropTypes.array,
  onSelectChange: PropTypes.func,
  selectData: PropTypes.array
}
export default MyGeneInput
