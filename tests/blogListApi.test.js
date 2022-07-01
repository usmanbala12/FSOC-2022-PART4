const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 20
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 21
    }
]


jest.setTimeout(100000)

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await api.post('/api/users').send({name: 'usman', username: 'codegeek01', password: 'secret'})
  result = await api.post('/api/login').send({username: 'codegeek01', password: 'secret'})
  token = result.body.token
  await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(blogs[0])
  await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(blogs[1])
})

describe('tests for get routes', () => {
  test('correct amount of blogs are returned in JSON format', async () => {
    const response = await api.get('/api/blogs').expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(blogs.length)
  })
  
  test('checking the unique identifier of a blog post is name id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('tests for posting blogs', () => {
  test('making a post request to /api/blog successfully adds a new blog in the right format', async () => {
    const newBlog = {
      title: "my new blog",
      author: "Usman bala",
      url: "http://mynewblog.com/newblog/2/31"
    }
  
    const addedBlog = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
  
    const numberOfBlogs = await Blog.find({})
    expect(numberOfBlogs).toHaveLength(blogs.length + 1)
  
    expect(addedBlog.body).toEqual(expect.objectContaining({
      title: expect.any(String),
      author: expect.any(String),
      url: expect.any(String),
      id: expect.any(String),
      likes: expect.any(Number)
    }))
    
  })
  
  test('if likes property is missing from request, it defaults to zero', async() => {
    const newBlog = {
      title: "my extremely new blog",
      author: "Usman bala",
      url: "http://myextremelynewblog.com/newblog/2/31"
    }
  
    const res = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog)
    expect(res.body.likes).toBe(0)
  })
  
  test('if title and url are missing, backend responds with 400 bad request', async() => {
    const newBlog = {
      author: "Usman bala"
    }
  
    const res = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog).expect(400)
  })
})

describe('delete operation on blogs', () => {
  test('deleting a resource', async () => {
    const blogsInDb = await api.get('/api/blogs')
    const blogToDelete = blogsInDb.body[0].id
  
    await api.delete(`/api/blogs/${blogToDelete}`).set('Authorization', `bearer ${token}`).expect(204)
  })
}) 

describe('update operation on blogs', () => {
  test('updating a resourse', async () => {
    const blogsInDb = await api.get('/api/blogs')
    const blogToUpdate = blogsInDb.body[0]
  
    blogToUpdate.likes += 1
  
    const updated = await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
    expect(updated.body.likes).toBe(blogToUpdate.likes)
  
  })
})


describe('tests for authorization', () => {
  test('if a delete request is made without authorization token, server responds with 401', async () => {
    const blogsInDb = await api.get('/api/blogs')
    const blogToDelete = blogsInDb.body[0].id
  
    await api.delete(`/api/blogs/${blogToDelete}`).expect(401)
  })
  
  test('making a post request to /api/blog successfully without authorization token returns 401', async () => {
    const newBlog = {
      title: "my new blog",
      author: "Usman bala",
      url: "http://mynewblog.com/newblog/2/31"
    }
  
    await api.post('/api/blogs').send(newBlog).expect(401)
    
  })
})


afterAll(() => {
    mongoose.connection.close()
  })