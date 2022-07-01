const blogListRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require("../models/blog")
const User = require('../models/user')

blogListRouter.get('/', async (request, response) => {
    const res = await Blog.find({}).populate('user', {name: 1, username: 1})
    response.json(res)
})

blogListRouter.post('/', async (request, response) => {
    const body = request.body

    if(!request.user){
        return response.status(401).json({error: 'user unauthorized'})
    }

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogListRouter.delete('/:id', async (request, response) => {
    
    if(!request.user){
        return response.status(401).json({error: 'unauthorized operation'})
    }

    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() !== user._id.toString()){
        return response.status(401).json({error: 'user unauthorized'})
    }

    user.blogs = user.blogs.filter(item => item.toString() !== blog._id.toString())
    await user.save()

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogListRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
})

module.exports = blogListRouter