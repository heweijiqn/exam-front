import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getBracketStr(text) {
  const result = []
  if (text === null) {
    return result
  }
  const regex = /\{{(.+?)\}}/g
  const options = text.match(regex)
  for (let i = 0; i < options.length; i++) {
    if (options[i]) {
      const option = options[i]
      if (option) {
        const tempStr = option.substring(2, option.length - 2)
        result.push(tempStr)
      }
    }
  }
  return result
}
