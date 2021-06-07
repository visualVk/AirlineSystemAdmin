import axios from '@/libs/api.request'

export const findCoupon = (data) => {
  return axios.request({
    url: '/coupon/findCouponByQuerySet',
    data,
    method: 'post'
  })
}

export const findCouponAllInfo = () => {
  return axios.request({
    url: '/coupon/findAllUserCouponInfo',
    method: 'post'
  })
}

export const deleteCoupon = (data) => {
  return axios.request({
    url: '/coupon/deleteCouponByIds',
    data,
    method: 'post'
  })
}

export const modifyCoupon = (data) => {
  return axios.request({
    url: '/coupon/updateCoupon',
    data,
    method: 'post'
  })
}

export const addCoupon = (data) => {
  return axios.request({
    url: '/coupon/insertCoupon',
    data,
    method: 'post'
  })
}

//
export const addRelationship = (data) => {
  return axios.request({
    url: '/coupon/insertRelationship',
    data,
    method: 'post'
  })
}

export const deleteRelationship = (data) => {
  return axios.request({
    url: '/coupon/deleteRelationShip',
    data,
    method: 'post'
  })
}