const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const result = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
    response.json(result)
})

userRouter.post('/', async (request, response) => {
    const {name, username, password} = request.body

    if(!password || password.length < 3){
        return response.status(400).json({error: 'password must be atleast three characters'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name, 
        username,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})



module.exports = userRouter