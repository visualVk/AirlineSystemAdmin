import axios from "@/libs/api.request"

export const findAllCity = () => {
  return axios.request({
    url: '/api/city/findAllCity',
    method: 'get'
  })
}