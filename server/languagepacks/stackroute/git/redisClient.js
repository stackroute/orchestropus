const redis = require('redis');
const config = require('./config');

module.exports = redis.createClient(config.REDIS_PORT, config.REDIS_HOST);
