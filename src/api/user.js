import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password,
    isAdmin: true,
    rememberMe: true
  }
  return axios.request({
    url: '/api/user/auth/login',
    data,
    method: 'post'
  })
}
//deprecated
export const getUserInfo = (token) => {
  return axios.request({
    url: '/api/user/auth/getUserInfo',
    // params: {
    //   token
    // },
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/api/user/auth/logout',
    method: 'post'
  })
}

export const findAllUser = () => {
  const data = {}
  return axios.request({
    url: '/api/user/auth/findUserByQuerySet',
    data,
    method: 'post'
  })
}

export const modifyFreeze = (data) => {
  return axios.request({
    url: '/api/user/auth/modifyFreeze',
    data,
    method: 'post'
  })
}
