import CodeMirror from 'codemirror';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './style.scss';


export default class Editor extends Component {
  componentDidMount() {
    const { onChange, value } = this.props;

    this.cm = CodeMirror(this.editor, {
      mode: 'jsx',
      theme: 'react',
      keyMap: 'sublime',
      viewportMargin: Infinity,
      lineNumbers: false,
      dragDrop: false
    });

    this.cm.setValue(value);

    this.cm.on('changes', cm => {
      if (onChange) {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          onChange(cm.getValue());
        }, 300);
      }
    });
  }
  getRef = ref => {
    this.editor = ref;
  }
  render() {
    return <div className="editor" ref={this.getRef} />;
  }
}

Editor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
};
