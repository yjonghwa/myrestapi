import httpStatus from "http-status"
import createError from "http-errors"

const login = async (req, res, next) => {
  try {
    return res.json({})
  } catch (e) {
    next(e)
  }
}

export {
  login
}