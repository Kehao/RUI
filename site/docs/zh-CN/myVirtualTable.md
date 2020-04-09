## MyVirtualTable 预览

### 基础用法

MyVirtualTable 在社区react-virtualized基础上封装成React组件

:::demo 


```js
render() {
  let dataSource = [];
  for(let i=0;i<500;i++){
    if(i%2===1){
      dataSource.push({name: '张思轶'+(i+1),id:i+1 , sex:'男',age: i+1});
    }else {
      dataSource.push({name: '江苏苏'+(i+1),id:i+1 , sex:'女',age: i+1});
    }
    
  }
  return (
    <MyVirtualTable
      height={300}
      rowKey={'id'}
      showIndex={true}
      dataSource={dataSource}
      columns={[
        {dataIndex: 'name', title: '姓名', width: 200},
        {dataIndex: 'sex', title: '性别', width: 200},
        {dataIndex: 'age', title: '年龄', width: 200},
      ]}
    />
  );
}
```
:::

### 配置参数
### Table
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| height | 表格高度| number   | —                         | 300           |
| dataSource | 数据数组| any[]   | —                         | —           |
| columns | 表格列的配置描述，具体项见下表 | ColumnProps[] | — | — |
| pagination | 分页器，参考配置项或 antd pagination 文档，设为 false 时不展示和进行分页 | object | — | — |
| onRowClick | 表格行点击事件 | function({ event, index, rowData }){}   | — | — |
| onRowDoubleClick | 表格行双击事件 | function({ event, index, rowData }){} | — | — |
| showIndex | 是否展示序号列  | boolean | — | false |
| onExpand | 表格行展开事件 | function(visible, rowData){}   | — | — |
| ExpandedRowRender | 额外的展开行 | function(rowData):ReactNode   | — | — |
| onSort | 排序事件 | function({ sortBy, sortDirection, virtualTableInstance }){}   | — | — |
| sortBy | 排序的受控属性，外界可用此控制列的排序，可设置为 'asc' 'desc' false | string,boolean  | — | — |
| sortDirection | 支持的排序方式 | sortDirectionProps | — | — |
| scrollToDataKey | 滚动至数据 | string   | — | — |
| setRowClassnames | 表格行的类名 | function({ index, record}):string | — | — |

### ColumnProps
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| fixed | 列是否固定，可选 | string | 'left' 'right' | — |
| title | 列头显示文字 | string | — | — |
| sorter | 是否可排序 | boolean | — | false |
| disableSearch | 是否显示搜索 | boolean | — | false |
| width | 列宽 | number | — | 100 |

### sortDirectionProps
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| ASC | 升序字段 | string | — | — |
| DESC | 降序字段 | string | — | — |