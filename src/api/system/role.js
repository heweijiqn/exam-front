import request from '@/utils/request'

/**
 * 查询角色列表
 * @param query
 * @returns {AxiosPromise}
 */
export function listRole(query) {
  return request({
    url: '/system/role/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加角色
 * @param role
 * @returns {AxiosPromise}
 */
export function addRole(role, params) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data: role,
    params: params
  })
}

/**
 * 查询角色
 * @param query
 * @returns {AxiosPromise}
 */
export function getRole(query) {
  return request({
    url: '/system/role/get',
    method: 'get',
    params: query
  })
}

/**
 * 删除角色
 * @param query
 * @returns {AxiosPromise}
 */
export function deleteRole(query) {
  return request({
    url: '/system/role/delete',
    method: 'get',
    params: query
  })
}

/**
 * 修改角色
 * @param role
 * @returns {AxiosPromise}
 */
export function updateRole(role, params) {
  return request({
    url: '/system/role/update',
    method: 'post',
    data: role,
    params: params
  })
}

/**
 * 查询所有角色
 * @param query
 * @returns {AxiosPromise}
 */
export function listAllRole() {
  return request({
    url: '/system/role/list',
    method: 'get'
  })
}
