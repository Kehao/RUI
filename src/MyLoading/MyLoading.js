import React from 'react';
import { createPortal } from 'react-dom';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

import './style/index.less';

/**
 * MyLoading 组件
 * @param {string} tip - loading的文本描述
 * @param {string} size - size控制Spin的大小
 * @param {boolean} loading - loading控制是否展示
 * @param {boolean} inner - inner控制是否局部挂载
 * @author: zhangsiyi@biosan.cn
 */
const MyLoading = ({ tip = '', size = '', loading = false, inner = false }) => {
  if (loading) {
    return inner ? (
      <div className={'bs-inner-loading-container'}>
        <Spin size={size || 'small'} className={'bs-loading'} />
      </div>
    ) : (
      createPortal(
        <div className={'bs-loading-container'}>
          <Spin tip={tip} size={size || 'large'} className={'bs-loading'} />
        </div>,
        document.querySelector('body')
      )
    );
  }
  return null;
};

MyLoading.propTypes = {
  tip: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.bool,
  inner: PropTypes.bool
};

export default MyLoading;
