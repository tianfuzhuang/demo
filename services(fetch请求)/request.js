import fetchPack from './fetch'
import { Message } from 'iview'
import config from '@/config'
// console.log(process.env.NODE_ENV);
const baseUrl = process.env.NODE_ENV === 'development' ? '' : config.baseUrl.pro
const BASE_URL = baseUrl + '/telesales-api/manage/'
// 响应拦截器
// 返回处理后的数据
fetchPack.interceptors.response.use((response) => {
  response = response.json()
  return response
})

/**
 * @function 请求封装
 * @param  {String} url 请求地址
 * @param  {Object} data 请求数据
 * @param  {String} method 请求方式 可以是get， post， 不填写默认post
 * @return {Promise} resolve参数成功时处理的数据，reject参数是失败时处理的数据
 */
export const request = function (url, data, method) {
  const config = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    credentials: 'include',
    mode: 'cors'
  }
  url = BASE_URL + url
  if (method && method.toLowerCase() === 'get') {
    config.method = 'GET'
    url = Object.keys(data).reduce((pre, item) => {
      return pre + encodeURIComponent(item) + '=' + encodeURIComponent(data[item])
    }, url + '?')
  } else if (!method || method.toLowerCase() === 'post') {
    config.method = 'POST'
    config.body = JSON.stringify(data)
  }
  return new Promise((resolve, reject) => {
    return fetchPack(url, config).then(res => {
      if (res.code === 1) {
        resolve(res.data)
      } else {
        Message.warning({
          content: res.msg,
          duration: 5
        })
        reject(res)
      }
    })
  })
}
