import request from '@/utils/request'

/**
 * 查询菜单列表
 * @param query
 * @returns {AxiosPromise}
 */
export function listMenu(query) {
  return request({
    url: '/system/menu/page',
    method: 'get',
    params: query
  })
}

/**
 * 添加菜单
 * @param role
 * @returns {AxiosPromise}
 */
export function addMenu(menu) {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data: menu
  })
}

/**
 * 查询目录和菜单
 * @param query
 * @returns {AxiosPromise}
 */
export function queryMC() {
  return request({
    url: '/system/menu/queryMC',
    method: 'get'
  })
}

/**
 * 查询菜单树形列表
 * @param query
 * @returns {AxiosPromise}
 */
export function listMenuTree() {
  return request({
    url: '/system/menu/tree',
    method: 'get'
  })
}

/**
 * 查询路由
 * @returns {AxiosPromise}
 */
export function getRouters() {
  return request({
    url: '/system/menu/getRouters',
    method: 'get'
  })
}

/**
 * 查询菜单
 * @param query
 * @returns {AxiosPromise}
 */
export function getMenu(query) {
  return request({
    url: '/system/menu/get',
    method: 'get',
    params: query
  })
}

/**
 * 修改菜单
 * @param role
 * @returns {AxiosPromise}
 */
export function updateMenu(menu) {
  return request({
    url: '/system/menu/update',
    method: 'post',
    data: menu
  })
}

/**
 * 删除菜单
 * @param query
 * @returns {AxiosPromise}
 */
export function deleteMenu(query) {
  return request({
    url: '/system/menu/delete',
    method: 'get',
    params: query
  })
}
