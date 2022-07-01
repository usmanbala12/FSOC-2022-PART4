const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const users = [
    {
        name: 'usman',
        username: 'codegeek',
        password: 'secret'
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(users[0])
    await userObject.save()
})

test('user with invalid password is not created and a suitable status code and error mesaage is returned', async () => {
    const invalidUser = {
        name: 'usman',
        username: 'usman22',
        password: '12'
    }

    const message = await api.post('/api/users').send(invalidUser).expect(400)
    expect(message.body.error).toBe('password must be atleast three characters')

})

test('duplicate username is not added', async () => {
    const invalidUser = {
        name: 'usman',
        username: 'codegeek',
        password: 'secret'
    } 
   const message = await api.post('/api/users').send(invalidUser).expect(400)
   expect(message.body.error).toBe('username is not unique')

})

afterAll(() => {
    mongoose.connection.close()
})