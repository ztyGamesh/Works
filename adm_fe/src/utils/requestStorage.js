/**
 * @description 通过后端存储数据
 */
import React from 'react'
import request from './request'
import { BUSINESSAPIHOST } from '../common/env'

async function setItem(key = '', data = {}) {
  if (!key) {
    return false
  }
  const req = { key, data: JSON.stringify(data) }
  const res = await request({
    url: `${BUSINESSAPIHOST}/data/saveToSession`,
    method: 'post',
    data: req
  })
  if (res && res.status === 1) {
    return true
  }
  return false
}

async function getItem(key = '') {
  if (!key) {
    return false
  }
  const req = { key }
  const res = await request({
    url: `${BUSINESSAPIHOST}/data/getSession`,
    method: 'get',
    data: req
  })
  if (res && res.status === 1) {
    return res.data && JSON.parse(res.data)
  }
  return false
}

export default {
  setItem,
  getItem
}