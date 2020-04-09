## Input 输入框

### 基础用法

基础的input用法。

:::demo 带有搜索按钮的输入框，2.5.0 时新增。


```js
render() {
  return (<div>
    <Input.Search
      placeholder="input search text"
      onSearch={value => console.log(value)}
      style={{ width: 200 }}
    />
    <br />
    <br />
    <Input.Search placeholder="input search text" onSearch={value => console.log(value)} enterButton />
    <br />
    <br />
    <Input.Search
      placeholder="input search text"
      enterButton="Search"
      size="large"
      onSearch={value => console.log(value)}
    />
  </div>)
}
```
:::