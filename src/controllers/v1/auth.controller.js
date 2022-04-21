import httpStatus from 'http-status'
import createError from 'http-errors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userRepo from '../../repositories/user.repository'
import response from '../../utils/response'

const login = async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const user = await userRepo.findByEmail(email)

    if (!user) {
      //console.log('!user')
      return next(createError(404, 'Cannot find user !!'))
    }

    // password comparison
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      //console.log('!match')
      return next(createError(422, 'Check your password !!'))
    }

    // jwt payload
    const payload = { 
      email: user.email,
      uuid: user.uuid
    }

    // create token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRESIN }
    )

    return response(res, {token})
  } catch (e) {
    next(e)
  }
}

const tokenTest = async (req, res, next) => {
  try {
    return response(res, req.user)
  } catch (e) {
    next(e)
  }
}

export {
  login, tokenTest
}