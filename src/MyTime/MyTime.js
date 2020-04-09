import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

class MyTime extends React.PureComponent {
  constructor(props) {
    super(props);
    this.interval = null
  }
  state = {
    mineTime: ''
  }
  static propTypes = {
    format: PropTypes.string,
    styles: PropTypes.object
  }
  static defaultProps = {
    format: 'YYYY-MM-DD',
    styles: { color: '#000', textSize: '16px' }
  }
  refershTime = () => {
    const { format } = this.props;
    const time = moment().format(format || MyTime.defaultProps.format);
    this.setState({ mineTime: time });
  }
  componentDidMount() {
    this.interval = setInterval(() => this.refershTime(), 1000)
  }
  render() {
    const { mineTime } = this.state;
    const { styles } = this.props;
    const defaltStyle = MyTime.defaultProps.styles;
    return (
      <span style={{ ...defaltStyle, ...styles }}>{ mineTime }</span>
    );
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
}

export default MyTime;
