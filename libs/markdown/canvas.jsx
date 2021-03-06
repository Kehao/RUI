import { transform } from '@babel/standalone';
import axios from 'axios';
import { Form, Tabs, Button, Icon, Modal } from 'antd';
import marked from 'marked';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from '../editor';
import { utils } from '../../src'

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.playerId = `${parseInt(Math.random() * 1e9, 10).toString(36)}`;
    this.document = this.props.children.match(/([^]*)\n?(```[^]+```)/);
    this.description = marked(this.document[1]);
    this.source = this.document[2].match(/```(.*)\n?([^]+)```/);

    this.state = {
      showBlock: false
    };
  }

  componentDidMount() {
    this.renderSource(this.source[2]);
  }

  blockControl() {
    this.setState({
      showBlock: !this.state.showBlock
    });
  }

  renderSource(value) {
    import('../../src').then(Element => {
      const args = ['context', 'React', 'ReactDOM', 'axios', 'Form', 'Tabs', 'Button', 'Icon', 'Modal', 'utils'];
      const argv = [this, React, ReactDOM, axios, Form, Tabs, Button, Icon, Modal, utils];

      // eslint-disable-next-line no-restricted-syntax
      for (const key in Element) {
        args.push(key);
        argv.push(Element[key]);
      }

      return {
        args,
        argv
      };
    }).then(({ args, argv }) => {
      const code = transform(`
        class Demo extends React.Component {
          ${value}
        }
        const FormDemo = Form.create()(Demo)
        ReactDOM.render(<FormDemo {...context.props} />, document.getElementById('${this.playerId}'))
      `, {
        presets: ['flow', 'react'],
        plugins: [['proposal-decorators', { legacy: true }], ['proposal-class-properties', { loose: true }]]
      }).code;

      args.push(code);
      // eslint-disable-next-line prefer-spread, no-new-func
      new Function(...args).apply(null, argv);

      this.source[2] = value;
    }).catch(err => {
      if (process.env.NODE_ENV !== 'production') {
        throw err;
      }
    });
  }

  render() {
    return (
      <div className={`demo-block demo-box demo-${this.props.name}`}>
        <div className="source" id={this.playerId} />
        {
          this.state.showBlock && (
            <div className="meta">
              {
                this.description && (
                  <div
                    ref="description"
                    className="description"
                    dangerouslySetInnerHTML={{ __html: this.description }}
                  />
                )
              }
              <Editor
                value={this.source[2]}
                onChange={code => this.renderSource(code)}
              />
            </div>
          )
        }
        <div className="demo-block-control" onClick={this.blockControl.bind(this)}>
          {
            this.state.showBlock ? (
              <span>
                <i className="el-icon-caret-top" />{this.props.locale.hide}
              </span>
            ) : (
              <span>
                <i className="el-icon-caret-bottom" />{this.props.locale.show}
              </span>
            )
          }
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  locale: PropTypes.object
};

Canvas.defaultProps = {
  locale: {}
};
