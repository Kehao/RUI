/*
 * @Author: 行一
 * @Date: 2019-07-18 14:01:19
 * @LastEditors: 行一
 * @LastEditTime: 2019-09-12 15:46:29
 */
export default function request({ url, data = {} }) {
  function formateData(data) {
    const formdata = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) formdata.append(key, data[key]);
    }
    return formdata;
  }

  return new Promise((resolve, reject) => {
    let xhr;
    const postdata = formateData(data);
    try {
      xhr = new XMLHttpRequest();
    } catch (e) {
      xhr = window.ActiveXobject('Msxml12.XMLHTTP');
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        return (xhr.status === 200) ? resolve(true) : reject(false);
      }
    };
    xhr.onerror = function (error) {
      reject(error);
    };
    xhr.open('post', url, true);
    xhr.send(postdata);
  });
}
