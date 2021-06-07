import axios from '@/libs/api.request'

export const findAllTicketType = () => {
  return axios.request({
    url: '/ticket/findAllTicketType',
    method: 'post'
  })
}

export const findAirlineTicket = (data) => {
  return axios.request({
    url: '/ticket/findTicketByQuerySet?page=1&size=100000000',
    data,
    method: 'post'
  })
}

export const cancelOrder = (data) => {
  return axios.request({
    url: '/ticket/cancelTicketByTicketIds',
    data,
    method: 'post'
  })
}

export const modifyTicketType = (data) => {
  return axios.request({
    url: '/ticket/updateTicketType',
    data,
    method: 'post'
  })
}