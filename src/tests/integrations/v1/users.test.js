import request from 'supertest'
import randomString from 'random-string'
import { uuid } from '../../../utils/uuid'
import models from '../../../models'
import userRepo from '../../../repositories/user.repository'

const app = require('../../../app')

let user

beforeAll(async () => {
  // create 2 users
  await userRepo.store({
    email: randomString() + '@test.com',
    password: randomString()
  })

  user = await userRepo.store({
    email: randomString() + '@test.com',
    password: randomString()
  })
})

afterAll(() => models.sequelize.close())

describe('GET: /v1/users', () => {
  test('Get All users ! | 200', async () => {
    let response = await request(app).get(`/v1/users`)
    console.log(response.body);
    expect(response.body.length).toBeGreaterThan(1)
  })

  test('Get user by userid ! | 200', async () => {
    let response = await request(app).get(`/v1/users/${user.uuid}`)
    
    expect(response.body.email).toBe(user.email)
  })

  test('Get user by wrong userid ! | 200', async () => {
    let response = await request(app).get(`/v1/users/${uuid()}`)
    
    expect(response.statusCode).toBe(404)
  })
})