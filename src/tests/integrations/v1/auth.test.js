require('dotenv').config()

import request from 'supertest'
import randomString from 'random-string'
import jwt from 'jsonwebtoken'
import models from '../../../models'
import userRepo from '../../../repositories/user.repository'

const app = require('../../../app')
//let userRepo
/*
beforeAll(() => {
  userRepo = new UserRepo()
})
*/
afterAll(() => models.sequelize.close())

describe('Login Test', () => {
  let userData
  let token

  console.log('AUTH TEST START !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

  console.log('Step 1 : create user');

  beforeAll(async () => {
    userData = {
      email: randomString() + '@test.com',
      password: randomString()
    }

    // 테스트용 사용자 생성
    await userRepo.store(userData)
  })

  console.log('Step 2 : login test');

  test('Login Test | 200', async () => {
    let response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.data.token).toBeTruthy()

    const payload = jwt.verify(response.body.data.token, process.env.JWT_SECRET)
    expect(userData.email).toBe(payload.email)

    const user = await userRepo.find(payload.uuid)
    expect(userData.email).toBe(user.email)

    console.log(payload)
    token = response.body.data.token
  })

  console.log('Step 2 : login test using non-user');

  test('Login test using non-use | 404', async () => {
    let response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'notFound@email.com',
        password: 'somePassword'
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.data.message).toBe('Cannot find user !!')
  })

  console.log('Step 3 : login test using wrong password');

  test('Login test using wrong password | 422', async () => {
    let response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: userData.email,
        password: 'wrongPassword'
      })

    expect(response.statusCode).toBe(422)
    expect(response.body.data.message).toBe('Check your password !!')
  })

  console.log('Step 4 : get user by token');

  test('GET User by token | 200', async () => {
    let response = await request(app)
      .get('/v1/auth/tokenTest')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body.data.email).toBe(userData.email)
  })

})