## numberOperate 能够解决js浮点数精度带来的运算问题

### 基础用法

四则运算示例

:::demo 

```js
handleClick = (type, num1, num2) => {
  alert(utils[type](num1, num2));
}

render() {
  return (
    <div>
      <div style = {{margin: '30px 0', fontSize: '18px', fontWeight: 'bold'}}>点击按钮计算出结果</div>
         <Button onClick = {() => {this.handleClick('add', 0.22, 0.33)}}> 0.22 + 0.33</Button>
         <br />
         <br />
         <Button onClick = {() => {this.handleClick('sub', 0.33, 0.13)}}> 0.33 - 0.13</Button>
         <br />
         <br />
         <Button onClick = {() => {this.handleClick('mul', 0.22, 0.33)}}> 0.22 * 0.33</Button>
         <br />
         <br />
         <Button onClick = {() => {this.handleClick('div', 0.44, 0.22)}}> 0.44 / 0.22</Button>
    </div>
  )
}
```

:::

### 工具方法

| 方法名        | 说明                                     | 使用示例          |
| ----------- | ---------------------------------------- | --------         |
| add         | 加法                                      | add(num1,num2)   |
| sub         | 减法                                      | sub(num1,num2)   |
| mul         | 乘法                                      | mul(num1,num2)   | 
| div         | 除法                                      | div(num1,num2)   |

