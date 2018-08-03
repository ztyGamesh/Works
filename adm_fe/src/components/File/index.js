/**
 * @description 文件处理
 */
import React from 'react'

import FileCsv from './FileCsv'
import FileDownloadCsv from './FileDownloadCsv'
import FileCreateCsv from './FileCreateCsv'

export {
  FileCsv,
  FileDownloadCsv,
  FileCreateCsv
}

import { BUSINESSAPIHOST } from '../../common/env'
import request from '../../utils/request'
const UPLOAD_URL = `${BUSINESSAPIHOST}/data/cacheCsv`
const READ_URL = `${BUSINESSAPIHOST}/data/downloadCachedFile`

export async function receiveCsvPath(filename, data = []) {
  const req = {
    filename,
    data: data.map((item = []) => {
      return item.map(t => {
        let s = ''
        let flag = false
        for (let i = 0, l = t.length; i < l; i++) {
          const v = t[i]
          if (v === ',') {
            flag = true
          } else if (v === '"') {
            s += '"'
            flag = true
          }
          s += v
        }
        return flag ? `"${s}"` : s
      })
    })
  }
  const res = await request({
    url: UPLOAD_URL,
    method: 'post',
    data: req
  })
  if (res && res.status === 1) {
    return READ_URL + '?id=' + res.data
  }
  return false
}