## MyGeneInput 基因录入组件

### 基础用法

MyGeneInput 基因录入组件是对α基因、β基因下的指标类型的选择

:::demo

```js

originOptionsA = [{
  value: '<span>αα</span>',
  label: <span>αα</span>
}, {
  value: '<span>--<sup>SEA</sup></span>',
  label: <span>--<sup>SEA</sup></span>
}]
originOptionsB = [{
  value: '<span>β<sup>N</sup></span>',
  label: <span>β<sup>N</sup></span>
}, {
  value: '<span>β<sup>CD41-42</sup></span>',
  label: <span>β<sup>CD41-42</sup></span>
}]

state = {
  tableOption:[{
    title:'α基因',
    dataIndex:'agen',
    width:'60',
    placeholder:'请选择',
    allowClear:false,
    // options:this.originOptionsA.map(item => {
    //         return {
    //           ...item,
    //           children: this.originOptionsA
    //         }
    //       }),
  },{
    title:'β基因',
    dataIndex:'bgen',
    width:'60',
    placeholder:'请选择',
    allowClear:false,
    // options:this.originOptionsB.map(item => {
    //           return {
    //             ...item,
    //             children: this.originOptionsB
    //           }
    //         }),
  }],
  dataSource: [{
        key: `${Date.now() + 1}`,
        agen: ['<span>αα</span>', '<span>αα</span>'],
        bgen: ['<span>β<sup>N</sup></span>', '<span>β<sup>N</sup></span>']
      }], 
}

  handleChange = (key, index, e) => {
    const { dataSource } = this.state
    if (key === 'agen' || key === 'bgen') {
      dataSource[index][key] = e
    } else {
      dataSource[index][key] = e.target.value
    }
    this.setState({
      dataSource: [...dataSource]
    })
  }

render() {
  const FormItem = Form.Item
  const getFieldDecorator = this.props.form.getFieldDecorator
  return (
    <FormItem>
    { getFieldDecorator('lectrophoresis', {
      rules: []
    })(
        <MyGeneInput tableOption={this.state.tableOption} dataSource={this.state.dataSource} onSelectChange={this.handleChange} selectData={this.state.selectData}/>) }
  </FormItem>
    )    
}

```

:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| tableOption | 列表表头选项| array   | <a>tableOption</a>[]| -         |
| dataSource | 列表数据 | array   | - | [] |

### API
| 方法名        | 说明                                    | 默认值      |
| ----------- | ---------------------------------------  | ----------- |
| onSelectChange | 选择完成后的回调| -|

### tableOption
```js
interface tableOption {
  title: string;
  dataIndex:string;
  width:string;
  placeholder:string,
  allowClear:boolean,
  options:[] //级联下拉框选择数据源，可选，如果需要修改组件下拉列表中数据，可传入该字段
}
``` 






