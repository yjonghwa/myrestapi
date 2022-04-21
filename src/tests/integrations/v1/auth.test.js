require('dotenv').config()

import request from 'supertest'
import randomString from 'random-string'
import jwt from 'jsonwebtoken'
import models from '../../../models'
import userRepo from '../../../repositories/user.repository'

const app = require('../../../app')

afterAll(() => models.sequelize.close())

describe('login test', () => {

  let userData;
  let token;

  beforeAll(async () => {
    userData = {
      email: randomString() + '@test.com',
      password:  randomString()
    }

    // create test user
    await userRepo.store(userData)
  })

  test('login test here | 200', async () => {
    let response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      })

    token = response.body.data.token

    expect(response.statusCode).toBe(200)
    expect(response.body.data.token).toBeTruthy()

    expect(response.statusCode).toBe(200)
    expect(response.body.data.token).toBeTruthy()

    const payload = jwt.verify(response.body.data.token, process.env.JWT_SECRET)
    expect(userData.email).toBe(payload.email)

    const user = await userRepo.find(payload.uuid)
    expect(userData.email).toBe(user.email)
    
    console.log(payload)
  })

  test('login test of not user | 404', async () => {
    let response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'notFound@email.com',
        password: 'somePassword'
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.data.message).toBe('Cannot find user !!')
    //expect(response.body.message).toBe('Cannot find user !!')
  })

  test('login test of wrong password | 404', async () => {
    let response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: userData.email,
        password: 'wrongPassword'
      })

    expect(response.statusCode).toBe(422)
    expect(response.body.data.message).toBe('Check your password !!')
    //expect(response.body.message).toBe('Check your password !!')
  })

  test('get user by token | 200', async () => {
    let response = await request(app)
      .get('/v1/auth/tokenTest')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body.data.email).toBe(userData.email)

    console.log(reponse.body.data)
  })
})