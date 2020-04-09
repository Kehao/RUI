/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;

/**
 * format
 *
 * @param {String} string
 * @param {Array} ...args
 * @return {String}
 */

export default function (string, ...args) {
  let temp = args;
  if (args.length === 1 && typeof args[0] === 'object') {
    temp = args[0];
  }

  if (!args || !args.hasOwnProperty) {
    temp = {};
  }

  return string.replace(RE_NARGS, (match, prefix, i, index) => {
    let result = '';

    if (string[index - 1] === '{' &&
      string[index + match.length] === '}') {
      return i;
    }
    result = Object.prototype.hasOwnProperty.call(temp, i) ? temp[i] : null;
    if (result === null || result === undefined) {
      return '';
    }

    return result;
  });
}
