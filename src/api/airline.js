import axios from '@/libs/api.request'

export const findAirlineInfo = (data) => {
  return axios.request({
    url: '/api/airlineInfo/findAirlineByQuerySet?page=1&size=10000000',
    data,
    method: 'post'
  })
}

export const deleteAirlineInfoByAirlineId = (airlineId) => {
  return axios.request({
    url: `/api/airlineInfo/deleteAirlineInfoByAInfoId?airlineId=${airlineId}`,
    method: 'post'
  })
}

export const modifyAirlineInfo = (data) => {
  return axios.request({
    url: `/api/airlineInfo/updateAirlineInfoByEntityAInfo`,
    data,
    method: 'post'
  })
}

export const addAirlineInfo = (data) => {
  return axios.request({
    url: '/api/airlineInfo/addAirlineInfo',
    data,
    method: 'post'
  })
}