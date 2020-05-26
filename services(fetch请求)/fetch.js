import 'whatwg-fetch'
import { Message } from 'iview'

/**
 * fetchPack
 * 基于原生fetch封装了拦截器功能，暴露出来的fetchPack跟原生fetch用法一致，只是增加了拦截器功能。拦截器用法参考axios的拦截器用法。
 * 拦截器: fetchPack.interceptors
 * 注意: 拦截器不拦截reject类型的response结果
 */
const codeMessage = {
  200: '请求成功。',
  201: '成功请求并创建了新的资源。',
  202: '已经接受请求，但未处理完成',
  204: '服务器成功处理，但未返回内容',
  400: '客户端请求的语法错误，服务器无法理解',
  401: '请求要求用户的身份认证',
  403: '服务器理解请求客户端的请求，但是拒绝执行此请求',
  404: '请求的资源（网页等）不存在',
  406: '服务器无法根据客户端请求的内容特性完成请求',
  410: '客户端请求的资源已经不存在',
  500: '内部服务器错误',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}
/**
 * @function 请求状态码检测
 * @param  {type} response {description}
 * @return {type} {description}
 */
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errorText = codeMessage[response.status] || response.statusText
  Message.error({
    content: `请求错误 ${response.status}: ${errorText}`,
    duration: 5
  })
  const error = new Error(errorText)
  error.name = response.status
  error.response = response
  throw error
}
// 定义用来存储拦截请求和拦截响应结果的处理函数集合
let interceptors_req = []
let interceptors_res = []

function fetchPack (url, config = {}) {
  // interceptors_req是拦截请求的拦截处理函数集合
  interceptors_req.forEach(interceptors => {
    config = interceptors(config) || {}
  })
  // fetch默认请求方式设为POST
  if (!config.method) {
    config.method = 'POST'
  }

  // 在原生fetch外面封装一个promise，为了在promise里面可以对fetch请求的结果做拦截处理。
  // 同时，保证fetchPack函数返回的结果是个promise对象。
  return new Promise(function (resolve, reject) {
    // 发起fetch请求，fetch请求的形参是接收上层函数的形参
    window.fetch(url, config).then(checkStatus).then(res => {
      // interceptors_res是拦截响应结果的拦截处理函数集合
      interceptors_res.forEach(interceptors => {
        // 拦截器对响应结果做处理，把处理后的结果返回给响应结果。
        res = interceptors(res)
      })
      // 将拦截器处理后的响应结果resolve出去
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 在fetchPack函数上面增加拦截器interceptors，拦截器提供request和response两种拦截器功能。
// 可以通过request和response的use方法来绑定两种拦截器的处理函数。
// use方法接收一个参数，参数为一个callback函数，callback函数用来作为拦截器的处理函数；
// request.use方法会把callback放在interceptors_req中，等待执行。
// response.use方法会把callback放在interceptors_res中，等待执行。
// 拦截器的处理函数callback接收一个参数。
// request拦截器的callback接收的是请求发起前的config；
// response拦截器的callback接收的是网络请求的response结果。
fetchPack.interceptors = {
  request: {
    use: function (callback) {
      interceptors_req.push(callback)
    }
  },
  response: {
    use: function (callback) {
      interceptors_res.push(callback)
    }
  }
}

export default fetchPack
