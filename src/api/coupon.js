import axios from '@/libs/api.request'

export const findCoupon = (data) => {
  return axios.request({
    url: '/api/coupon/findCouponByQuerySet',
    data,
    method: 'post'
  })
}

export const findCouponAllInfo = () => {
  return axios.request({
    url: '/api/coupon/findAllUserCouponInfo',
    method: 'post'
  })
}

export const deleteCoupon = (data) => {
  return axios.request({
    url: '/api/coupon/deleteCouponByIds',
    data,
    method: 'post'
  })
}

export const modifyCoupon = (data) => {
  return axios.request({
    url: '/api/coupon/updateCoupon',
    data,
    method: 'post'
  })
}

export const addCoupon = (data) => {
  return axios.request({
    url: '/api/coupon/insertCoupon',
    data,
    method: 'post'
  })
}

//
export const addRelationship = (data) => {
  return axios.request({
    url: '/api/coupon/insertRelationship',
    data,
    method: 'post'
  })
}

export const deleteRelationship = (data) => {
  return axios.request({
    url: '/api/coupon/deleteRelationShip',
    data,
    method: 'post'
  })
}