import request from '@/utils/request'

/**
 * 查询考题列表
 * @param query
 * @returns {AxiosPromise}
 */
export function listQuestion(query) {
  return request({
    url: '/exam/question/page',
    method: 'get',
    params: query
  })
}

/**
 * 查询所有题型
 * @returns {AxiosPromise}
 */
export function listTypes() {
  return request({
    url: '/exam/question/type',
    method: 'get'
  })
}

/**
 * 添加考题
 * @param params
 * @returns {AxiosPromise}
 */
export function add(params) {
  return request({
    url: '/exam/question/add',
    method: 'post',
    data: params
  })
}
