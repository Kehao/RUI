/*
 * @Author: 行一
 * @Date: 2019-08-29 13:37:39
 * @LastEditors: 行一
 * @LastEditTime: 2019-08-29 13:37:39
 */
import qs from 'qs';

/* eslint-disable no-console */
const error = console.error;

/**
 * request contentType
 * 转换httpbody
 */
export function transformHttpBody(contentType) {
  const _contentType = contentType.toUpperCase();
  switch (_contentType) {
    case 'JSON':
      return {
        type: 'application/json; charset=UTF-8',
        transform(params) {
          try {
            return JSON.stringify(params);
          } catch (_error) {
            error(_error);
            return {};
          }
        }
      };
    // case 'QUERYSTRING':
    //   return {
    //     type: 'application/x-www-form-urlencoded; charset=UTF-8',
    //     transform(params) {
    //       try {
    //         return qs.stringify(params, { arrayFormat: 'brackets' });
    //       } catch (_error) {
    //         error(_error);
    //         return '';
    //       }
    //     },
    //   };
    case 'FORMDATA':
      return {
        type: 'multipart/form-data',
        transform(params) {
          const isFormdata = Object.prototype.toString.call(params) === '[object FormData]';
          if (isFormdata) return params;
          return Object.keys(params).reduce((formdata, b) => {
            formdata.append(b, params[b]);
            return formdata;
          }, new FormData());
        }
      };
    case 'QUERYSTRING':
    default:
      return {
        type: 'application/x-www-form-urlencoded; charset=UTF-8',
        transform(params) {
          try {
            return qs.stringify(params, { arrayFormat: 'brackets' });
          } catch (_error) {
            error(_error);
            return '';
          }
        }
      };
  }
}

export function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}

/**
 * 用于判断obj是否为纯粹的对象（所谓”纯粹的对象”，就是该对象是通过”{}”或”new Object”创建的。）
 * @param {object} obj
 */
export function isPlainObject(obj) {
  const getProto = Object.getPrototypeOf;

  const class2type = {};

  const toString = class2type.toString;

  const hasOwn = class2type.hasOwnProperty;

  const fnToString = hasOwn.toString;

  const ObjectFunctionString = fnToString.call(Object);

  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }

  const proto = getProto(obj);

  if (!proto) {
    return true;
  }
  const Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
}
