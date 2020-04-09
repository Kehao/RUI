/*
 * @Author: 行一
 * @Date: 2019-06-07 09:39:35
 * @LastEditors: 行一
 * @LastEditTime: 2019-06-07 09:39:35
 */
import { requireCondition } from './assert';
import * as Errors from './errors';
import * as ReactUtils from './react';

export { default as DateUtils } from './date';
export { IDGenerator } from './IDGenerator';
export { requireCondition, ReactUtils, Errors };

export function watchPropertyChange(target, property, cb) {
  requireCondition(
    target != null &&
    typeof property === 'string' &&
    typeof cb === 'function', 'invalid arguments');

  let cache = null;
  if (!target) return;
  if (!target.__watch_cache) {
    target.__watch_cache = {};
  }
  cache = target.__watch_cache;

  requireCondition(cache[property] == null, `duplicated watch on ${target} 's ${property}`);
  cache[property] = cb;

  let origin = target[property];

  Object.defineProperty(target, property, {
    configurable: true,

    get() {
      return origin;
    },

    set(value) {
      origin = value;
      if (cache[property]) {
        cache[property](origin);
      }
    },
  });

  return () => {
    if (target.__watch_cache && target.__watch_cache[property]) {
      delete target.__watch_cache[property];
      delete target[property];
      target[property] = origin;
    }
  };
}

export function createPropType(validate) {
  // Chainable isRequired
  function checkType(isRequired, props, propName, componentName) {
    const _componentName = componentName || '<<anonymous>>';
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(
          `Required \`${propName}\` was not specified in ` +
          `\`${_componentName}\`.`,
        );
      }
      return null;
    }
    return validate(props, propName, _componentName);
  }

  const chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

// take from :  http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
export function hashCode(str) {
  if (str == null || str.length === 0) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
}

export function pick(obj, keys) {
  requireCondition(obj != null && Array.isArray(keys));

  const r = {};
  keys.forEach(e => r[e] = obj[e]);
  return r;
}

export function range(start, stop, step) {
  let tempStart = start;
  let tempStop = stop;
  let tempStep = step;
  if (tempStop == null) {
    tempStop = tempStart || 0;
    tempStart = 0;
  }
  if (!tempStep) {
    tempStep = tempStop < tempStart ? -1 : 1;
  }

  const length = Math.max(Math.ceil((tempStop - tempStart) / tempStep), 0);
  const range = Array(length);

  for (let idx = 0; idx < length; idx++, tempStart += tempStep) {
    range[idx] = tempStart;
  }

  return range;
}

