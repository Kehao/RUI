## MySelect 远程调用select

### 基础用法

MySelect

:::demo 使用方式与Select类似


```js
constructor(props) {
  super(props);

  this.state = {
  };
}
handleChange(value) {
  console.log(value);
}
render() {
    return (
        <div className="clearfix">
          <MySelect
            requestConfig={{
              url: 'http://172.16.0.51:8040/sku/docking/dockingOrgDeptListDetailSearch?orgId=000976',
              method: 'get'
            }}
            optionsConfig={{label: 'orgFullname', value: 'orgId'}}
            onChange={this.handleChange}/>
        </div>
    );
}
```
:::