## MyFamilyInput 家系输入组件

### 基础用法

:::demo

```js

state = {
  sampleTypeList: [
    { sampleType: '全血', sampleTypeId: '4cf7013a627711e996ee005056a034f4' },
    { sampleType: 'DNA', sampleTypeId: '4c6c9f4a627711e996ee005056a034f4' },
    { sampleType: '白细胞', sampleTypeId: '4cfee796627711e996ee005056a034f4' }
  ]
}

render() {
  const FormItem = Form.Item
  const getFieldDecorator = this.props.form.getFieldDecorator
  const familyInputValidator = (rule, value, callback) => {
    let msg = null
    if (value && value.length) {
      value.forEach((item) => {
        if (!(item.patientName && item.patientName.trim().length)) {
          msg = '请填写姓名!'
        }
      })
    } else {
      msg = '请填入至少一项数据!'
    }
    msg && callback(msg) || callback()
  }
  return <FormItem>
    { getFieldDecorator('familyTable', {
      rules: [{ validator: familyInputValidator }],
      initialValue: [
        {
          id: `1`,
          patientName: '测试名1',
          sampleType: '全血',
          admissionNo: '123',
          remark: '测试备注1',
          sex: '男',
          disabled: false
        },
        {
          id: `2`,
          patientName: '测试名2',
          sampleType: 'DNA',
          admissionNo: '123',
          remark: '测试备注2',
          sex: '女',
          disabled: true // 是否可更改
        }
      ]
    })(<MyFamilyInput sampleTypeList={this.state.sampleTypeList} />) }
  </FormItem>
}
```

:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| maxHeight | 组件最大高度| number   | 200 | 无          |
| sampleTypeList | 样本类别 | array   | 见代码显示 | [] |
