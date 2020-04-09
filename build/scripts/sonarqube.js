/*
 * @Author: 行一
 * @Date: 2019-09-12 14:40:30
 * @LastEditors: 行一
 * @LastEditTime: 2019-09-12 14:47:07
 */
const sonarqubeScanner = require('sonarqube-scanner') //.customScanner;
sonarqubeScanner({
  serverUrl: 'http://172.16.10.22:9000',
  token: '3002e92e555638f9127748b047f9b6789c1767bb', // 需按项目修改
  options: {
    'sonar.projectKey': 'biosanUI', // 需按项目修改
    'sonar.projectName': 'biosanUI', // 需按项目修改
    'sonar.scm.disabled': 'true',
    'sonar.sources': './',
    'sonar.exclusions': '**/node_modules/**,**/bower_components/**,**/justForBackup/**,**/dist/**,**/build/**', // 需按项目修改，基本是**/node_modules/**,**/bower_components/**
    'sonar.sourceEncoding': 'UTF-8'
  }
})