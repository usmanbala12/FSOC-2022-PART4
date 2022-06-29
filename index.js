const http = require('http')
const app = require('./app')
const config_env = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

const PORT = config_env.PORT
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})