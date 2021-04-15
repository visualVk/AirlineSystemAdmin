import axios from '@/libs/api.request'

export const findAllTicketType = () => {
  return axios.request({
    url: '/api/ticket/findAllTicketType',
    method: 'post'
  })
}