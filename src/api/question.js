import axios from '@/libs/api.request'

export const findAllQuestion = (data) => {
  return axios.request({
    url: '/api/question/findQuestionByQuerySet',
    data,
    method: 'post'
  })
}

export const addQuestion = (data) => {
  return axios.request({
    url: '/api/question/insertQuestion',
    data,
    method: 'post'
  })
}

export const deleteQuestion = (data) => {
  return axios.request({
    url: '/api/question/deleteQuestionByIds',
    data,
    method: 'post'
  })
}

export const modifyQuestion = (data) => {
  return axios.request({
    url: '/api/question/updateQuestion',
    data,
    method: 'post'
  })
}