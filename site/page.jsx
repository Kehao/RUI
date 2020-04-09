import React from 'react';
import ScrollToTop from 'react-scroll-up';
import { i18n } from '../src';
import zh from '../src/locale/lang/zh-CN';
import locales from './locales';
import pages from './pages';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    window.addEventListener('hashchange', () => {
      window.scrollTo(0, 0);

      this.setPage();
    }, false);
  }

  componentDidMount() {
    this.setPage(() => {
      if (!this.state.locale) {
        this.setLocale(localStorage.getItem('ELEMENT_LANGUAGE') || 'zh-CN');
      }
    });
  }

  componentDidUpdate(props, state) {
    if (state.locale !== this.state.locale) {
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (this.state.locale) {
        default:
          i18n.use(zh); break;
      }
    }
  }

  getLocale(key) {
    const map = locales[this.state.locale] || {};
    return key.split('.').reduce((a, b) => {
      const parent = map[a];

      if (b) {
        return (parent || {})[b];
      }

      return parent;
    });
  }

  setLocale(locale) {
    window.location.hash = `/${locale}/${this.state.page}`;
  }

  getPage() {
    const routes = location.hash.match(/(?:\/(.+))?\/(.+)/);
    if (routes) {
      if (Object.hasOwnProperty.call(locales, routes[1])) {
        this.setState({ locale: routes[1] }, () => {
          localStorage.setItem('BIOSAN_LANGUAGE', this.state.locale);
        });
      }

      return routes[2];
    }

    return 'quick-start';
  }

  setPage(fn) {
    this.setState({ page: this.getPage() }, fn);
  }

  getComponent(page) {
    this.components = this.components || Object.assign(Object.values(pages.components).reduce((a, b) => Object.assign(a, b), {}), pages.documents, pages.utils);
    const result = this.components[page];
    if (result) {
      return React.createElement(result.default, {
        locale: {
          show: this.getLocale('markdown.show'),
          hide: this.getLocale('markdown.hide')
        }
      });
    }
    return null;
  }
  renderSubMenu(menus) {
    return Object.keys(menus).map(page => (
      <li className="nav-item" key={page}>
        <a href={`#/${this.state.locale}/${page}`} className={page === this.state.page ? 'active' : ''}>{this.getLocale(`page.${page}`)}</a>
      </li>
    ));
  }
  render() {
    return (
      <div className="app">
        <header className="header">
          <div className="container">
            <h1>
              <img src={'//biosan-saas.oss-cn-beijing.aliyuncs.com/FD/common/logo.png'} style={{ width: 50, height: 50 }} alt="" />
            </h1>
            <ul className="nav">
              <li className="nav-item">
                <a className="active">{this.getLocale('misc.component')}</a>
              </li>
            </ul>
          </div>
        </header>
        <div className="main container">
          <nav className="side-nav">
            <ul>
              <li className="nav-item">
                <a>{this.getLocale('misc.development')}</a>
                <ul className="pure-menu-list sub-nav">
                  {
                    this.renderSubMenu(pages.documents)
                  }
                </ul>
              </li>
              <li className="nav-item">
                <a>{this.getLocale('misc.components')}</a>
                {
                  Object.keys(pages.components).map(group => (
                    <div className="nav-group" key={group}>
                      <div className="nav-group__title">{group}</div>
                      <ul className="pure-menu-list">
                        {
                          this.renderSubMenu(pages.components[group])
                        }
                      </ul>
                    </div>
                  ))
                }
              </li>
              <li className="nav-item">
                <a>{this.getLocale('misc.utils')}</a>
                <ul className="pure-menu-list sub-nav">
                  {
                    this.renderSubMenu(pages.utils)
                  }
                </ul>
              </li>
            </ul>
          </nav>
          <div className="content">
            {this.getComponent(this.state.page)}
            <ScrollToTop showUnder={210}>
              <div className="page-component-up">
                <i className="el-icon-caret-top">^</i>
              </div>
            </ScrollToTop>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="footer-main">
              <p className="footer-main-title">Biosan-React</p>
            </div>
            <div className="footer-social">
              <a href="http://git.biosan.cn/FD/BiosanUi" target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-line global-require */}
                <img src={require('./assets/github.png')} alt="" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
