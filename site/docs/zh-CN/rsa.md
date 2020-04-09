## RSA方法工具

能够解决字符串进行RSA公钥生成、私钥生成、加密和解密。注：对接统一登录需要RSA加密，如有需要可参考此工具方法

### 基础用法

RSA 在社区node-rsa基础上封装成RSA工具方法

:::demo

```js
generate = () => {
  const key = utils.RSA.generateKey()
  document.getElementById('publicKey').value = key.publicKey
  document.getElementById('privateKey').innerText = key.privateKey
}
showEncrypt = () => {
  const publicKey = document.getElementById('publicKey').value
  const contentValue = document.getElementById('content').value
  if (publicKey) {
    if (contentValue) {
      document.getElementById('result').innerText = utils.RSA.encrypt(contentValue, publicKey)
    } else {
      alert('请输入文本')
    }
  } else {
    alert('请生成或输入公钥')
  }
}
showDecrypt = () => {
  const privateKey = document.getElementById('privateKey').innerText
  const keyString =  document.getElementById('result').innerText
  if (privateKey) {
    document.getElementById('keyString').innerText = utils.RSA.decrypt(keyString, privateKey)
  } else {
    alert('请生成私钥')
  }
}
render() {
  return (
    <div>
      <div style = {{margin: '30px 0', fontSize: '18px', fontWeight: 'bold'}}> 可视化操作 </div>
         <Button onClick = {() => {this.generate()}}> 秘钥生成 </Button>
         <br />
         <textarea id='publicKey' rows={6} style={{width: 700}}/>
         <br />
         <span id='privateKey'></span>
         <br />
         文本输入：<input id='content'/>   
          <br />
          <br />
         <Button onClick = {() => this.showEncrypt()}> 加密 </Button>
         <br/>
         <span id='result' style={{wordWrap: 'break-word'}}></span>
         <br />
         <br />
         <Button onClick = {() => this.showDecrypt()}> 解密 </Button>
         <br/>
          <span id='keyString'></span>
    </div>
  )
}
```

:::

### 工具对象

| 对象名       | 说明                                                  |
| ----------- | ----------------------------------------------------- |
| RSA         | 统一封装对象，包含generateKey, encrypt, decrypt三个方法  |

### 对象方法
|方法名        | 说明                                                   | 
|------------ | ----------------------------------------------------- | 
| generateKey | RSA公钥私钥生成（加密格式和输出格式需统一），加密采用pem格式. =>callback({publicKey, privateKey})  |
| encrypt     | RSA采用公钥加密（加密格式和输出格式需统一）                 |
| decrypt     | RSA采用私钥解密（加密格式和输出格式需统一）                 |


### generateKey参数
| 参数名          | 说明                               | 类型      | 可选值                 | 默认值      |
| ---------------| --------------------------------- | ---------| ---------------------- | ----------- |
| encryptedFormat| 加密格式（不采用 无填充和SSLV23格式） | string   | 'pkcs1' or 'pkcs1_oaep'|  pkcs1     |
| outputFormat   | 输出格式                           | string   | 'pkcs1' or 'pkcs8'     |  pkcs8     |
| len            | 秘钥长度                           | number   | -                      |  512     |

### encrypt参数
| 参数名          | 说明                               | 类型      | 可选值                 | 默认值      |
| ---------------| --------------------------------- | ---------| ---------------------- | ----------- |
| value          | 值                                | string   | -                      |  -     |
| key            | 加密公钥                           | string   | -                      |  -     |
| encryptedFormat| 加密格式（不采用 无填充和SSLV23格式） | string   | 'pkcs1' or 'pkcs1_oaep'|  pkcs1     |
| outputFormat   | 输出格式                           | string   | 'pkcs1' or 'pkcs8'     |  pkcs8     |


### decrypt参数
| 参数名          | 说明                               | 类型      | 可选值                 | 默认值      |
| ---------------| --------------------------------- | ---------| ---------------------- | ----------- |
| value          | 值                                | string   | -                      |  -     |
| privateKey     | 解密私钥                           | string   | -                      |  -     |
| encryptedFormat| 加密格式（不采用 无填充和SSLV23格式） | string   | 'pkcs1' or 'pkcs1_oaep'|  pkcs1     |
| outputFormat   | 输出格式                           | string   | 'pkcs1' or 'pkcs8'     |  pkcs8     |
