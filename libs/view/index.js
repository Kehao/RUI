import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class View extends Component {
  render() {
    const style = Object.hasOwnProperty.call(this.props, 'show') && !this.props.show && {
      display: 'none'
    };

    return React.cloneElement(React.Children.only(this.props.children), {
      style: Object.assign({}, this.props.children.props.style, style)
    });
  }
}

/* eslint-disable */
View.propTypes = {
  show: PropTypes.any
};
/* eslint-enable */

View._typeName = 'View';
