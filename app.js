const mongoose = require('mongoose')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const config_env = require('./utils/config')
const morgan = require('morgan')
const middleware = require('./utils/middleware')

const blogListRouter = require('./controllers/bloglist')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

mongoose.connect(config_env.MONGODB_URI).then(() => {
    console.log('connected to db')
}).catch(error => {
    console.log('error connecting to db')
})

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

morgan.token("body-content", (req, res) => JSON.stringify(req.body))
if(process.env.NODE_ENV !== 'test'){
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body-content"))
}


app.use('/api/blogs', blogListRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)

//this has to be the last loaded middleware
app.use(middleware.errorHandler)

module.exports = app