import request from '@/utils/request'

/**
 * 查询考试结果列表
 * @returns {AxiosPromise}
 */
export function list(query) {
  return request({
    url: '/exam/result/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询考试结果详情
 * @returns {AxiosPromise}
 */
export function detail(query) {
  return request({
    url: '/exam/result/detail',
    method: 'get',
    params: query
  })
}

/**
 * 查询待批阅列表
 * @returns {AxiosPromise}
 */
export function marks(query) {
  return request({
    url: '/exam/result/marks',
    method: 'get',
    params: query
  })
}

/**
 * 打分
 * @returns {AxiosPromise}
 */
export function doMark(params) {
  return request({
    url: '/exam/result/doMark',
    method: 'post',
    data: params
  })
}
