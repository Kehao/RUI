## 快速上手

### 安装
推荐使用 npm 的方式安装，它能更好地和`webpack`打包工具配合使用。

```shell
npm i biosan-react-ui --save
```

### 使用

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { MyComponent } from 'biosan-react-ui';

ReactDOM.render(<MyComponent type="primary">Hello</MyComponent>, document.getElementById('app'));

```
