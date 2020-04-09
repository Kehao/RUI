import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Resizable } from 'react-resizable';
import Immutable from 'immutable';
import ReactDOM from 'react-dom';
import { Popover, Pagination, Checkbox, Spin, Icon, Input } from 'antd';
import { debounce } from '../utils/common';
import { isPlainObject } from '../utils/helper';
import { defaultTableHeaderRowRenderer, SortDirection } from './react-virtualized/source';
import { Column, Table } from './react-virtualized/source/Table';
import './react-virtualized/source/styles.css'; // only needs to be imported once

const Search = Input.Search;
// import BaseTable from './baseComp';
// Table data as an array of objects
const PopoverContainer = ({ children }) => {
  function stopPropagation(e) {
    e && e.stopPropagation();
  }

  return (<div className="ReactVirtual__popover__container" onClick={stopPropagation}>
    {children}
  </div>);
};
export default class VirtualTable extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    rowSelection: PropTypes.object,
    pagination: PropTypes.object,
    rowKey: PropTypes.string,
    onRowDoubleClick: PropTypes.func,
    onRowClick: PropTypes.func,
    showIndex: PropTypes.bool,
    onExpand: PropTypes.func,
    ExpandedRowRender: PropTypes.func,
    columns: PropTypes.array,
    height: PropTypes.number,
    onSort: PropTypes.func,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    loading: PropTypes.bool,
    scrollToDataKey: PropTypes.string,
    setRowClassnames: PropTypes.func
  };

  allRowKeys = [];
  rowHeight = 25;
  // sortedDataSource = _defaultSort();
  constructor(props, context) {
    super(props, context);
    const sortedDataSource = this._defaultSort(this.props.dataSource);
    const { sortBy, sortDirection, columns } = this.props;
    this.state = {
      dataSource: sortedDataSource,
      expandedRowKeys: [],
      sortBy,
      sortDirection,
      Columns: this.formatColumns(columns),
      columnsData: columns
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      const sortedDataSource = this._defaultSort(nextProps.dataSource);
      this.setState({
        dataSource: sortedDataSource
      });
      sortedDataSource.forEach(element => {
        this.props.rowKey && this.allRowKeys.push(element[this.props.rowKey]);
      });
    }
    if (this.props.columns !== nextProps.columns) {
      this.setState({
        columnsData: nextProps.columns,
        Columns: this.formatColumns(nextProps.columns)
      });
    }
    if (this.props.sortBy !== nextProps.sortBy || this.props.sortDirection !== nextProps.sortDirection) {
      this.setState({
        sortBy: nextProps.sortBy,
        sortDirection: nextProps.sortDirection
      });
    }// 受控的排序信息
    if (nextProps.scrollToDataKey && (this.props.scrollToDataKey !== nextProps.scrollToDataKey)) {
      let value = '';
      this.state.dataSource.map((item, index) => {
        if (item[this.props.rowKey] === nextProps.scrollToDataKey) {
          value = index;
        }
        return item;
      });
      this._onScrollToRowChange(value);
    }
  }

  componentDidMount() {
    this.listenCenterTableScroll();
    this.setFixedTable();
  }

  componentDidUpdate(prevProps, prevState) {
    this.listenCenterTableScroll();
    this.setFixedTable();
    if (prevState.dataSource !== this.state.dataSource) {
      this._initScrollToIndex();
    }
  }

  onRowClick = ({ event, index, rowData }) => {
    this.props.onRowClick && this.props.onRowClick(event, index, rowData);
  };

  onRowDoubleClick = ({ event, index, rowData }) => {
    this.props.onRowDoubleClick &&
      this.props.onRowDoubleClick(event, index, rowData);
  };

  selectedAll = e => {
    const isChecked = e.target.checked;
    if (this.props.rowSelection.selectedAll) {
      this.props.rowSelection.selectedAll(
        isChecked,
        isChecked ? this.allRowKeys : [],
        isChecked ? this.props.dataSource : []
      );
    }
  };

  onSelect = (e, cellData, rowData) => {
    e && e.stopPropagation();
    const _selectedKeys = this.props.rowSelection.selectedKeys;
    const dataSource = this.props.dataSource;
    const rowKey = this.props.rowKey;
    const isChecked = e.target.checked;
    let selectedKeys = [];
    let selectedRows = [];
    if (!isChecked) {
      selectedKeys = [..._selectedKeys].filter(element => element !== cellData);
    } else {
      selectedKeys = [..._selectedKeys, cellData];
    }
    selectedRows = [...dataSource].filter(item =>
      selectedKeys.includes(item[rowKey])
    );
    this.props.rowSelection.onSelected && this.props.rowSelection.onSelected(
      isChecked,
      selectedKeys,
      selectedRows,
      cellData,
      rowData
    );
  };

  checkboxHandler = e => {
    e && e.stopPropagation();
  }

  getTableHeader = e => {
    this.centerTableHeader = e;
  };

  getTableGrid = e => {
    if (e) {
      this.gridBody = ReactDOM.findDOMNode(e.Grid);
      this._addGridScrollListener();
    }
  };

  getLeftTable = e => {
    this.leftTable = e;
    if (e) {
      this.leftTableBody = ReactDOM.findDOMNode(e.Grid);
    }
  };

  getRightTable = e => {
    this.rightTable = e;
    if (e) {
      this.rightTableBody = ReactDOM.findDOMNode(e.Grid);
    }
  };

  listenCenterTableScroll = () => {
    const centerTable = this.gridBody;
    // 禁用左右固定table的scroll事件
    // setTimeout(() => {
    function wheel(event) {
      const e = event || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }

    const leftTable = ReactDOM.findDOMNode(this.leftTable);
    this.ReactVirtual__table__fixed_left = leftTable && leftTable.querySelector(
      '.ReactVirtualized__Table__Grid'
    );
    this.ReactVirtual__table__fixed_left && (this.ReactVirtual__table__fixed_left.onmousewheel = wheel);

    const rightTable = ReactDOM.findDOMNode(this.rightTable);
    this.ReactVirtual__table__fixed_right = rightTable && rightTable.querySelector(
      '.ReactVirtualized__Table__Grid'
    );
    this.ReactVirtual__table__fixed_right && (this.ReactVirtual__table__fixed_right.onmousewheel = wheel);
    // }, 1000);

    // 监听center__table的scroll事件
    // 防抖处理
    centerTable && (centerTable.onscroll = debounce(e => {
      this.ReactVirtual__table__fixed_left && (this.ReactVirtual__table__fixed_left.scrollTop = e.target.scrollTop);
      this.ReactVirtual__table__fixed_right && (this.ReactVirtual__table__fixed_right.scrollTop = e.target.scrollTop);
    }, 350));
  }

  setFixedTable = () => {
    const visibleHeight = this.setVisibleHeight();
    const scrollbarWidth = this.setScrollbarWidth();
    // const { tableHeight } = this.state;
    if (visibleHeight !== this.visibleHeight) {
      this.visibleHeight = visibleHeight;
      this.leftTableBody &&
        (this.leftTableBody.style.height =
          `${visibleHeight}px`);
      this.rightTableBody &&
        (this.rightTableBody.style.height =
          `${visibleHeight}px`);
    }
    if (scrollbarWidth !== this.scrollbarWidth) {
      this.scrollbarWidth = scrollbarWidth;
      const centerTableScrollPadding = this.scrollbarWidth; // virtualTable 在出现滚动条时会给table加 数值为滚动条宽度的 paddingRight
      this.rightTable &&
        (ReactDOM.findDOMNode(this.rightTable).style.right =
          `${scrollbarWidth}px`);
      this.rightTable &&
        (ReactDOM.findDOMNode(this.rightTable).style.paddingRight =
          `${centerTableScrollPadding}px`);
      this.centerTableHeader &&
        (this.centerTableHeader.style.marginRight =
          `${centerTableScrollPadding}px`);
    }
  };

  setVisibleHeight = () => this.gridBody.clientHeight || 0;

  setScrollbarWidth() {
    if (this.gridBody) {
      const Grid = this.gridBody;
      const clientWidth = Grid.clientWidth || 0;
      const offsetWidth = Grid.offsetWidth || 0;
      return offsetWidth - clientWidth;
    }
    return 0;
  }

  _addGridScrollListener = () => {
    const _this = this;
    this.gridBody.addEventListener('scroll', () => {
      _this.centerTableHeader.children[0].style.left = `${-this.scrollLeft}px`;
    });
  };

  _onScrollToRowChange(value) {
    if (!value && value !== 0) {
      return;
    }
    const { dataSource } = this.state;
    let scrollToIndex = Math.min(
      dataSource.size,
      parseInt(value, 10),
    );

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    this.gridBody.scrollTop = scrollToIndex * this.rowHeight;
  }

  _initScrollToIndex = () => {
    this.SearchDataKey = '';
    this.SearchIndexList = [];
    this.SearchIndex = 0;
  }

  _defaultTableHeaderRowRenderer = (props, tableType) => {
    const columns = props.columns;
    const SearchColumns = columns.map(item => {
      const { cellRenderer, dataKey, label, disableSearch } = item.props;
      const { key } = item;
      return (<Resizable
        key={`${key}_resizable`}
        height={this.rowHeight}
        width={item.props.style.width}
        style={{ outline: '1px solid #fff' }}
        onResize={(e, { size }) => {
          const propsColumns = this.state.columnsData;
          this.setState(() => {
            const nextColumns = propsColumns.map(columnsItem => {
              if (columnsItem.dataIndex === dataKey) {
                return {
                  ...columnsItem,
                  width: size.width
                };
              }
              return {
                ...columnsItem
              };
            });
            return {
              columnsData: nextColumns,
              Columns: this.formatColumns(nextColumns)
            };
          });
        }}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        {disableSearch ? item : <div className="ReactVirtual__Table__Search__Header__Warpper">
          <div className="ReactVirtual__Table__Search__Header__Label" >{item}</div>
          <div className="ReactVirtual__Table__Search__Header__Search">
            <Popover
              content={
                <div>
                  <Search
                    ref={node => { this.searchInput = node; }}
                    placeholder={`查询${label}`}
                    onSearch={text => {
                      const SearchIndexList = [];
                      const SearchDataKey = dataKey + text;
                      if (this.SearchDataKey !== SearchDataKey) {
                        this.state.dataSource.map((record, rowIndex) => {
                          let value = record[dataKey];
                          if (typeof (cellRenderer) === 'function') {
                            const getText = val => {
                              if (typeof (val) === 'object') {
                                return getText(val.props.children) || '';
                              }
                              return val;
                            };
                            value = cellRenderer({ cellData: value, rowData: record, rowIndex });
                            value = getText(value);
                          }
                          if (value && value.indexOf(text) > -1) {
                            SearchIndexList.push(rowIndex);
                          }
                          return item;
                        });
                        this.SearchDataKey = SearchDataKey;
                        this.SearchIndexList = SearchIndexList;
                        this.SearchIndex = 0;
                      } else {
                        this.SearchIndex++;
                      }
                      this._onScrollToRowChange(this.SearchIndexList[this.SearchIndex % this.SearchIndexList.length]);
                    }}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                  />
                </div>
              }
              placement="topRight"
              trigger="click"
            >
              <Icon type="search" />
            </Popover>

          </div>
        </div>}</Resizable>);
    });
    return (
      <div
        style={{
          background: '#5a6a82',
          overflow: 'hidden',
          borderTopLeftRadius: (tableType === 'right' || tableType === 'center' ? '5px' : ''),
          borderTopRightRadius: (tableType === 'right' ? '' : '5px')
        }}
        ref={tableType === 'center' ? this.getTableHeader : ''}>
        {defaultTableHeaderRowRenderer({
          ...props,
          columns: SearchColumns,
          style: {
            ...props.style,
            position: 'relative',
            overflow: 'visible' // 覆盖
          }
        })}
      </div>
    );
  };

  setRowClassnames = index => {
    const { rowKey, rowSelection, setRowClassnames } = this.props;
    let rowClassName = index % 2 === 1 ? 'ReactVirtual_form-row-odd' : 'ReactVirtual_form-row-noodd';
    const { dataSource = {}, expandedRowKeys } = this.state;
    const currentLineRowKey = index > -1 && dataSource.get(index)[rowKey];
    const rowClass = setRowClassnames && (typeof setRowClassnames === 'function' ? setRowClassnames({ index, record: dataSource.get(index) }) : setRowClassnames);
    if (rowClass) {
      rowClassName += ` ${rowClass}`;
    }
    if (!currentLineRowKey) {
      return '';
    }
    const isSelected = rowSelection && rowSelection.selectedKeys.includes(currentLineRowKey);
    if (isSelected) {
      rowClassName += ' ReactVirtualized__Row__selected';
    }
    // 子表悬显，row背景色
    if (expandedRowKeys.includes(currentLineRowKey)) {
      rowClassName += ' ReactVirtualized__ExpandedRow';
    }
    return rowClassName;
  };

  _defaultSort = (dataSource = []) => {
    const { sortBy, sortDirection } = this.props;
    return this._sortList({ sortBy, sortDirection, dataSource });
  };

  _sort = ({ sortBy, sortDirection }) => {
    const { onSort } = this.props;
    if (onSort) {
      onSort({ sortBy, sortDirection, virtualTableInstance: this });
    } else {
      const sortedDataSource = this._sortList({ sortBy, sortDirection, dataSource: this.props.dataSource });
      this.setState({ dataSource: sortedDataSource });
    }
    this.setState({ sortBy, sortDirection });
  };

  _sortList = ({ sortBy, sortDirection, dataSource = [] }) => {
    // dataSource = (dataSource.length ? dataSource : this.props.dataSource) || [];
    const list = Immutable.List(dataSource);
    if (dataSource && dataSource.length && sortBy) {
      return list
        .sortBy(item => item[sortBy])
        .update(listItem =>
          (sortDirection === SortDirection.DESC ? listItem.reverse() : listItem)
        );
    }
    return list;
  };

  _getDatum(list, index) {
    return list.get(index % list.size);
  }

  diffFixedColumns = (columns = []) => {
    const leftColumns = [];
    const rightColumns = [];
    const centerColumns = [];
    columns.forEach(item => {
      if (item.fixed === 'right') {
        rightColumns.push(item);
      } else if (item.fixed === 'left') {
        leftColumns.push(item);
      } else {
        centerColumns.push(item);
      }
    });
    return {
      leftColumns,
      rightColumns,
      centerColumns: leftColumns.concat(centerColumns).concat(rightColumns) // 解决配置情况下  左右固定列乱序的情况
    };
  };

  transColumns = (columns = []) => columns.map(item => {
    const cellRenderer = item.render
      ? ({ cellData, rowData, rowIndex }) => {
        const returnItem = item.render(cellData, rowData, rowIndex);
        if (isPlainObject(returnItem)) {
          if (returnItem.$$typeof) {
            return returnItem;
          }
          return '';
        }// 判断render返回值是否为纯粹的函数    暂时解决当react子节点为object时报错的问题
        return returnItem;
      }
      : ({ cellData }) => cellData;
    return (
      <Column
        key={item.dataIndex}
        flexShrink={0}
        label={item.title}
        cellRenderer={cellRenderer}
        dataKey={item.dataIndex}
        disableSort={!item.sorter}
        disableSearch={item.disableSearch}
        width={parseInt(item.width, 10) || 100}
      />
    );
  });

  handleExpandedRowIcon = e => {
    e && e.stopPropagation();
  }

  PopoverVisibleChange = (rowKey, visible) => {
    const expandedRowKeys = visible ? [...this.state.expandedRowKeys, rowKey] : [...this.state.expandedRowKeys].filter(key => key !== rowKey);
    this.setState({ expandedRowKeys });
  }

  handleExpandedCancel = () => {
    const documentOriginalHandler = document.onclick;
    document.onclick = event => {
      // handle original cb
      documentOriginalHandler && documentOriginalHandler();
      if (event && event.target.className.indexOf('ReactVirtual__expandedRow__icon') > -1) { return; }
      // 当前若存在展开项收起
      if (this.expandedRowIsOpen) {
        const filterKeys = [...this.state.expandedRowKeys].filter(key => key !== this.expandedRowIsOpen);
        this.setState({ expandedRowKeys: filterKeys }, () => {
          this.expandedRowIsOpen = null;
        });
      }
    };
  }

  formatColumns = (columns = []) => {
    const Columns = this.diffFixedColumns(columns);
    Object.keys(Columns).forEach(item => {
      Columns[item] = this.transColumns(Columns[item]);
    })
    return Columns;
  };

  getPrefixColumns = () => {
    const { ExpandedRowRender, rowSelection, rowKey, showIndex, onExpand } = this.props;
    const ExpandedRowRenderColumn = ExpandedRowRender ? (<Column
      flexShrink={0}
      cellRenderer={({ rowData }) => (
        <Popover
          overlayClassName="ReactVirtual__Popover"
          content={<PopoverContainer><ExpandedRowRender rowData={rowData} /></PopoverContainer>}
          placement="bottomLeft"
          title=""
          trigger="click"
          onVisibleChange={onExpand ? visible => {
            this.PopoverVisibleChange(rowData[rowKey], visible);
            onExpand(visible, rowData);
          } : null}

        >
          <span className="ReactVirtual__expandedRow__icon"
            onClick={e => this.handleExpandedRowIcon(e, rowData[rowKey])}>
            {this.state.expandedRowKeys.includes(rowData[rowKey]) ? '-' : '+'}
            {/* {'+'} */}
          </span>
        </Popover>
      )}
      key={'index'}
      dataKey={'index'}
      width={32}
      disableSort
      disableSearch
    />) : null;
    const rowSelectionColumn = rowSelection ? (<Column
      label={
        <Checkbox onChange={e => this.selectedAll(e)} />
      }
      flexShrink={0}
      cellRenderer={({ cellData, rowData, rowIndex }) => (
        <Checkbox
          data-rowKey={cellData}
          checked={rowSelection.selectedKeys.includes(cellData)}
          onChange={e => this.onSelect(e, cellData, rowData, rowIndex)}
          onClick={this.checkboxHandler}
        />
      )}
      key={rowKey}
      dataKey={rowKey}
      width={40}
      disableSort
      disableSearch
    />) : null;
    const showIndexColumn = showIndex ? (<Column
      flexShrink={0}
      label={''}
      cellRenderer={({ rowIndex }) => rowIndex + 1}
      key={'index'}
      dataKey="index"
      width={40}
      disableSort
      disableSearch
    />) : null;
    return [ExpandedRowRenderColumn, rowSelectionColumn, showIndexColumn];
  }

  noRowsRenderer() {
    return (<div
      style={{
        textAlign: 'center',
        lineHeight: '30px',
        borderBottom: '1px solid #e8e8e8',
        color: 'rgba(0,0,0,0.45)'
      }}
    >暂无数据</div>);
  }

  render() {
    const { pagination, height = 300, loading = false } = this.props;
    const { dataSource = {}, Columns = {} } = this.state;
    const { leftColumns = [], rightColumns = [], centerColumns = [] } = Columns;
    return (
      <div className="ReactVirtual__Table__container">
        <Spin spinning={loading}>
          {Boolean(leftColumns.length) && <Table
            width={120}
            height={height}
            className="ReactVirtual__Table_left"
            headerHeight={30}
            headerClassName={'table_head_style'}
            rowHeight={this.rowHeight}
            onRowClick={this.onRowClick}
            onRowDoubleClick={this.onRowDoubleClick}
            // onRowMouseOut={()=>{
            //     this.setState({
            //         hoverIndex: -1
            //     })
            // }}
            // onRowMouseOver={({event, index}) => {
            //     this.setState({
            //         hoverIndex: index
            //     })
            // }}
            rowCount={dataSource.size || 0}
            rowGetter={({ index }) => this._getDatum(dataSource, index)}
            rowClassName={({ index }) => this.setRowClassnames(index)}
            headerRowRenderer={props => this._defaultTableHeaderRowRenderer(props, 'right')}
            ref={this.getLeftTable}
            sort={this._sort}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
          >
            {
              this.getPrefixColumns()
            }
            {leftColumns}
          </Table>
          }
          <Table
            width={900}
            height={height}
            className="ReactVirtual__Table__center"
            headerHeight={30}
            headerClassName={'table_head_style'}
            rowHeight={this.rowHeight}
            onRowClick={this.onRowClick}
            onRowDoubleClick={this.onRowDoubleClick}
            noRowsRenderer={this.noRowsRenderer}
            // onRowMouseOut={()=>{
            //     this.setState({
            //         hoverIndex: -1
            //     })
            // }}
            // onRowMouseOver={({index}) => {
            //     this.setState({
            //         hoverIndex: index
            //     })
            // }}
            // onRowMouseOut={({event, index}) => {
            //   event.preventDefault();
            //   let currentLine = document.querySelector(`.ReactVirtualized__Table__row[aria-rowindex='${index + 1}']`);
            //   let classNames = currentLine.className.split(' ');
            //   classNames = classNames.filter(className => !(className.indexOf('ReactVirtual__Table__hover') > -1));
            //   currentLine.className = classNames.join(' ');
            // }}
            // onRowMouseOver={({event, index}) => {
            //   event.preventDefault();
            //   let currentLine = document.querySelector(`.ReactVirtualized__Table__row[aria-rowindex='${index + 1}']`);
            //   currentLine.className = `${currentLine.className} ReactVirtual__Table__hover`;
            // }}
            rowCount={dataSource.size}
            rowGetter={({ index }) => this._getDatum(dataSource, index)}
            rowClassName={({ index }) => this.setRowClassnames(index)}
            headerRowRenderer={props =>
              this._defaultTableHeaderRowRenderer(props, 'center')
            }
            ref={this.getTableGrid}
            sort={this._sort}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
          >
            {
              this.getPrefixColumns()
            }
            {centerColumns}
          </Table>
          {Boolean(rightColumns.length) && <Table
            width={120}
            height={height}
            className="ReactVirtual__Table_right"
            headerHeight={30}
            headerClassName={'table_head_style'}
            rowHeight={this.rowHeight}
            onRowClick={this.onRowClick}
            onRowDoubleClick={this.onRowDoubleClick}
            // onRowMouseOut={()=>{
            //     this.setState({
            //         hoverIndex: -1
            //     })
            // }}
            // onRowMouseOver={({index}) => {
            //     this.setState({
            //         hoverIndex: index
            //     })
            // }}
            rowCount={dataSource.size}
            rowGetter={({ index }) => this._getDatum(dataSource, index)}
            rowClassName={({ index }) => this.setRowClassnames(index)}
            headerRowRenderer={this._defaultTableHeaderRowRenderer}
            ref={this.getRightTable}
            sort={this._sort}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
          >
            {rightColumns}
          </Table>
          }
          {Boolean(dataSource.size && pagination) &&
            <Pagination
              size="small"
              className="ReactVirtual__Table__pagination"
              {...pagination}
            />}
        </Spin>
      </div>
    );
  }
}
