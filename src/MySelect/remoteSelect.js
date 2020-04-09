import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from '../utils/common';
import request from '../utils/request';

const { Option } = Select;

export default class RemoteSelect extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.search = debounce(this.search, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false
  };

  static propTypes = {
    requestConfig: PropTypes.object,
    optionsConfig: PropTypes.object,
    onChange: PropTypes.func
  }

  static defaultProps = {
    optionsConfig: {
      label: 'balel',
      value: 'value'
    },
    placeholder: '请输入关键字',
    /**
     * value值变化回调
     */
    onChange: val => val
  }

  search = value => {
    const { optionsConfig, requestConfig } = this.props;
    this.setState({ data: [], fetching: true });
    requestConfig.params = Object.assign(requestConfig.params || {}, { searchKey: value });
    request(requestConfig).then(resp => {
      if (!resp || !Array.isArray(resp.data)) {
        this.setState({ fetching: false });
        return;
      }
      const data = resp.data.map(item => ({
        text: item[optionsConfig.label],
        value: item[optionsConfig.value]
      }));
      this.setState({ data, fetching: false });
    }).catch(() => {
      this.setState({ fetching: false });
    });
  };

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false
    });
    this.props.onChange(value);
  };

  render() {
    const { fetching, data } = this.state;
    const { optionsConfig, requestConfig, onChange, ...rest } = this.props;
    return (
      <Select
        mode="multiple"
        labelInValue
        value={this.state.value}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.search}
        onChange={this.handleChange}
        style={{ width: '100%' }}
        {...rest}
      >
        {data.map(item => (
          <Option key={item.value} value={item.value}>{item.text}</Option>
        ))}
      </Select>
    );
  }
}
