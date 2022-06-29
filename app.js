const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const config_env = require('./utils/config')
const morgan = require('morgan')

const blogListRouter = require('./controllers/bloglist')


mongoose.connect(config_env.MONGODB_URI).then(() => {
    console.log('connected to db')
}).catch(error => {
    console.log('error connecting to db')
})

app.use(cors())
app.use(express.json())

morgan.token("body-content", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body-content"))

app.use('/api/blogs', blogListRouter)

module.exports = app