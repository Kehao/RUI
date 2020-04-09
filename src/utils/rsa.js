import NodeRSA from 'node-rsa';

/**
 * 公钥私钥生成
 * @param encryptedFormat 加密格式 'pkcs1' or 'pkcs1_oaep'. Default 'pkcs1'
 * @param outputFormat 输出格式 'pkcs1' or 'pkcs8'. Default 'pkcs8'
 * @param len 秘钥长度
 * @returns {object}
 */
const generateKey = (encryptedFormat = 'pkcs1', outputFormat = 'pkcs8', len = 512) => {
  const key = new NodeRSA({ b: len });
  key.setOptions({ encryptionScheme: encryptedFormat }); // 指定加密格式
  // 生成 公钥私钥，制定输出格式 pkcs8标准，pem格式 默认采用base64格式，不做字节der处理
  const publicPem = key.exportKey(`${outputFormat}-public-pem`);
  const privatePem = key.exportKey(`${outputFormat}-private-pem`);
  return { publicKey: publicPem, privateKey: privatePem };
};
/**
 * 输出处理
 * @param key 秘钥
 * @param type 输出格式 'pkcs1' or 'pkcs8'.
 * @param publicOrPrivate 公钥或者私钥 PUBLIC PRIVATE
 * @returns {string} result
 */
const handleKeyFun = (key, type, publicOrPrivate) => {
  const handleFun = (mainKey, param) => {
    let keyTemp = mainKey;
    if (key.indexOf(`${param} KEY-----`) === -1) {
      if (type === 'pkcs1') {
        keyTemp = `-----BEGIN RSA ${param} KEY-----${mainKey}-----END RSA ${param} KEY-----`;
      } else if (type === 'pkcs8') {
        keyTemp = `-----BEGIN ${param} KEY-----${mainKey}-----END ${param} KEY-----`;
      }
    }
    return keyTemp
  };
  return handleFun(key, publicOrPrivate);
};
/**
 * 加密
 * @param key 加密公钥
 * @param value 需加密值
 * @param encryptedFormat 加密格式 'pkcs1' or 'pkcs1_oaep'. Default 'pkcs1'
 * @param outputFormat 输出格式 'pkcs1' or 'pkcs8'. Default 'pkcs8'
 * @returns {string} result
 */
const encrypt = (value, key, encryptedFormat = 'pkcs1', outputFormat = 'pkcs8') => {
  try {
    if (!key || !value) {
      return '参数不可为空'
    }
    const pubKey = new NodeRSA(handleKeyFun(key, outputFormat, 'PUBLIC'));
    pubKey.setOptions({ encryptionScheme: encryptedFormat });
    return pubKey.encrypt(value, 'base64');
  } catch (e) {
    return '秘钥规则错误'
  }
};

/**
 * 解密
 * @param value 需解密值
 * @param privateKey 私钥
 * @param encryptedFormat 加密格式 'pkcs1' or 'pkcs1_oaep'. Default 'pkcs1'
 * @param outputFormat 输出格式 'pkcs1' or 'pkcs8'. Default 'pkcs8'
 * @returns {string} result
 */
const decrypt = (value, privateKey, encryptedFormat = 'pkcs1', outputFormat = 'pkcs8') => {
  try {
    if (!privateKey || !value) {
      return '参数不可为空'
    }
    const keyString = new NodeRSA(handleKeyFun(privateKey, outputFormat, 'PRIVATE'));
    keyString.setOptions({ encryptionScheme: encryptedFormat });
    return keyString.decrypt(value, 'utf8');
  } catch (e) {
    return e
  }
};

export {
  generateKey,
  encrypt,
  decrypt
}
