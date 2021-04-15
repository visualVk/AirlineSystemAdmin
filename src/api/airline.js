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

//航班
export const findAirlineSeat = (data) => {
  return axios.request({
    url: '/api/airlineInfo/findAirlineInfoByQuerySet?page=1&size=100000000',
    data,
    method: 'post'
  })
}

export const addAirlineSeat = (data) => {
  return axios.request({
    url: '/api/airlineInfo/addAirlineSeat',
    data,
    method: 'post'
  })
}

export const deleteAirlineSeatById = (airlineSeatId) => {
  return axios.request({
    url: `/api/airlineInfo/deleteAirlineSeatByASeatId?airlineSeatId=${airlineSeatId}`,
    method: 'post'
  })
}

export const modifyAirlineSeat = (data) => {
  return axios.request({
    url: '/api/airlineInfo/updateAirlineSeatByASeatEntity',
    data,
    method: 'post'
  })
}