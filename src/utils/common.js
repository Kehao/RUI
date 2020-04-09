import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import uniqueId from 'lodash.uniqueid';
import { isObject } from './helper';
/**
 * 本地存储
*/
const storage = {
  storage: window.localStorage,
  session: {
    storage: window.sessionStorage
  }
};

const storageApi = {
  set(key, value) {
    if (!key || !value) return;
    let _val = value;
    if (typeof value === 'object') {
      try {
        _val = JSON.stringify(value);
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
        return;
      }
    }
    this.storage.setItem(key, _val);
  },
  get(key) {
    if (!key) return;
    let value = this.storage.getItem(key);
    try {
      value = JSON.parse(value);
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error);
    }
    // eslint-disable-next-line consistent-return
    return value;
  },
  remove(key) {
    if (!key) return;
    this.storage.removeItem(key);
  },
  clear() {
    this.storage.clear();
  }
};

storage.__proto__ = storageApi;
storage.session.__proto__ = storageApi;


/**
 * deepCopy
 * 对象/数组深拷贝
 */
function deepCopy(source) {
  if (!isObject(source)) return source;

  const target = Array.isArray(source) ? [] : {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = deepCopy(source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function hasClass(el, className) {
  const reg = new RegExp(`(^|\\s)${className}(\\s|$)`)
  return reg.test(el.className)
}

function addClass(el, className) {
  if (!el) {
    return
  }
  if (hasClass(el, className)) {
    return
  }
  const newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ') // eslint-disable-line
}

/**
 * 生成唯一id
 */
const generatorId = (prefix = 'nodeinfo_id') => uniqueId(prefix);

export {
  hasClass,
  addClass,
  storage,
  Cookies as cookies,
  deepCopy,
  debounce,
  throttle,
  generatorId
};

