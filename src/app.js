require('dotenv').config()

import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import response from './utils/response'
import v1Route from './routes/v1'

// jwt token middleware
import jwtMiddleware from './middlewares/jwt.middleware'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// get user from jwt before controller
app.use(jwtMiddleware)

// express는 route도 middleware로 처리한다
// middleware는 순차적으로 처리되는 것을 기억한다

// /routes/v1 디렉토리 안에 있는 모든 route를 로드한다
app.use('/v1', v1Route)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // next를 넣지 않으면 무한정 기다리게 된다
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  let apiError = err

  if (!err.status) {
    apiError = createError(err)
  }

  // set locals, only providing error in development
  res.locals.message = apiError.message
  res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {}

  // render the error page
  return response(res, {
    message: apiError.message
  }, apiError.status)
  //return res.status(apiError.status)
  //  .json({message: apiError.message})
})

// bin/www 를 그대로 사용하기 위해서 예외적으로 commonJs 문법을 적용
module.exports = app
