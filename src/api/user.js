import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password,
    isAdmin: true,
    rememberMe: true
  }
  return axios.request({
    url: '/user/auth/login',
    data,
    method: 'post'
  })
}
//deprecated
export const getUserInfo = (token) => {
  return axios.request({
    url: '/user/auth/getUserInfo',
    // params: {
    //   token
    // },
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/user/auth/logout',
    method: 'post'
  })
}

export const findAllUser = () => {
  const data = {}
  return axios.request({
    url: '/user/auth/findUserByQuerySet',
    data,
    method: 'post'
  })
}

export const modifyFreeze = (data) => {
  return axios.request({
    url: '/user/auth/modifyFreeze',
    data,
    method: 'post'
  })
}

export const modifyUserInfo = (data) => {
  return axios.request({
    url: '/user/auth/modifyUserInfo',
    data,
    method: 'post'
  })
}
