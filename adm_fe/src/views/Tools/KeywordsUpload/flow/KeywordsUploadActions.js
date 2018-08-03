import {
  KEYWORDSUPLOAD_INIT,
  KEYWORDSUPLOAD_CHANGE_ROWS,
  KEYWORDSUPLOAD_CHANGE_INITED
} from './KeywordsUploadConstants'

export function keywordsUploadInit() {
  return {
    type: KEYWORDSUPLOAD_INIT
  }
}

export function keywordsUploadChangeRows(rows) {
  return {
    type: KEYWORDSUPLOAD_CHANGE_ROWS,
    data: {
      rows: rows
    }
  }
}

export function keywordsUploadChangeInited() {
  return {
    type: KEYWORDSUPLOAD_CHANGE_INITED
  }
}