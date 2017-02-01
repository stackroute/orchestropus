module.exports = {
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost',
  WORKSPACE_DIR: process.env.WORKSPACE_DIR || '/tmp',
  CMD_PREFIX: './cmd',
  QUEUE_NAME: 'stackroute/javascript'
}