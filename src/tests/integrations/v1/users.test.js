import request from 'supertest'
import randomString from 'random-string'
import { uuid } from '../../../utils/uuid'
import models from '../../../models'
import userRepo from '../../../repositories/user.repository'

const app = require('../../../app')

let user

beforeAll(async () => {
  // create 2 users
  console.log('Step 1 : create user 1');

  // 첫번째 user는 user객체에 저장하지 않는다
  await userRepo.store({
    email: randomString() + '@test.com',
    password: randomString()
  })

  console.log('Step 1 : create user 2');

  // 두번째 user는 user객체에 저장해서 뒤에서 검색되도록 한다
  user = await userRepo.store({
    email: randomString() + '@test.com',
    password: randomString()
  })
})

afterAll(() => models.sequelize.close())

describe('GET: /v1/users', () => {

  console.log('USER TEST START !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

  test('Get All users ! | 200', async () => {
    console.log('Step 3 : GET /v1/users');
    let response = await request(app).get(`/v1/users`)
    console.log(response.body);
    expect(response.body.length).toBeGreaterThan(1)
  })

  test('Get user by userid ! | 200', async () => {
    console.log('Step 4 : GET user by userid');
    console.log('user.uuid ====>  ' + user.uuid)
    let response = await request(app).get(`/v1/users/${user.uuid}`)
    console.log(response.body);
    expect(response.body.email).toBe(user.email)
  })

  test('Get user by wrong userid ! | 200', async () => {
    console.log('Step 5 : GET user by wrong userid');
    let response = await request(app).get(`/v1/users/${uuid()}`)
    
    expect(response.statusCode).toBe(404)
  })

})