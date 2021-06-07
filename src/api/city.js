import axios from "@/libs/api.request"

export const findAllCity = () => {
  return axios.request({
    url: '/city/findAllCity',
    method: 'get'
  })
}