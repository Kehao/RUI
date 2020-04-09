## request

### 基础用法

通用请求方法


:::demo `utils.request`
```js

request() {
  /*
  * 一些全局配置
  */
    utils.request.axios.defaults.baseURL = 'http://172.16.27.24:8010';
    utils.request.axios.defaults.withCredentials = false;
    utils.request.isSucc = resp => resp.code === 0;

    utils.request({
        url: '/nda/file/getPolicy',
        method: 'post',
        // contentType: 'queryString',
        // contentType: 'json',
        contentType: 'formdata',
        params: {
          a: 1,
          b: 2,
        }
    }).then(resp => console.log(resp)).catch(error => console.error(error));
}
render() {
  return (
    <div>
      <Button onClick={this.request}>request</Button>
    </div>
  )
}
```
:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| url         | 接口地址（全地址路径，baseURL不起作用） | string   | —                         | —           |
| contentType | 上传数据类型                            | string   | queryString,json,formdata | queryString |
| params      | 待上传数据                              | object   | obj, formdata             | {}          |
| timeout     | 接口超时时间                            | number   | —                         | 5000        |
| success     | 成功回调                                | function | —                         | —           |
| error       | 失败回调                                | function | —                         | —           |

### 全局配置参数
| 参数   | 说明                                                             | 类型     | 可选值 | 默认值 |
| ------ | ---------------------------------------------------------------- | -------- | ------ | ------ |
| isSucc | 判断接口是否成功的函数                                           | function | 自定义 | —      |
| axios  | axios支持的所有配置（baseURL、Authorization、withCredentials等） | —        | —      | —      |
