## MyTime 时间显示器

### 基础用法


:::demo 


```js
constructor(props){
  super(props);
}
render(){
    return (
      <div>
        <div>
          默认样式：<MyTime />
        </div>
        <div>
          样式1——显示年月日 时分秒：<MyTime format="YYYY-MM-DD HH:mm:ss" />
        </div>
        <div>
          样式2——显示时分秒 年月日：<MyTime format="HH:mm:ss YYYY-MM-DD" styles={{color: "#555", fontSize:"18px"}}  />
        </div>
        <div>
          样式3——只显示时分秒：<MyTime format="HH:mm:ss" styles={{color: "red", fontSize:"18px"}}  />
        </div>
        <div>
          样式4——显示时分秒 上午/下午：<MyTime format="hh:mm:ss a" styles={{color: "blue", fontSize:"18px"}}  />
        </div>
        <div>
          样式5——显示星期 年月日<MyTime format="dddd YYYY-MM-DD" styles={{color: "blue", fontSize:"18px"}}  />
        </div>
      </div>
    );
}
```
:::

### 配置参数
| 参数        | 说明                                    | 类型     | 可选值                    | 默认值      |
| ----------- | --------------------------------------- | -------- | ------------------------- | ----------- |
| format | 时间格式化，默认不传为YYYY-MM-DD| string   | —                         | 60%           |
| styles | 需要修改的样式                            | object   | — | — |
