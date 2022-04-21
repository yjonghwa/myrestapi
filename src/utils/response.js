const httpStatus = require('http-status');

export default (res, data = {}, code = httpStatus.OK) => {

  res.status(code).json({ data })
/*
  let result = { success: true }

  if (code > 399) {
    result.success = false
  }

  if (typeof data === 'object') {
    result = Object.assign({ data }, result)
  }

  return result.status(code).json(result)
*/
}