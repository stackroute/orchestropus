const client = require('../redisClient').duplicate();

module.exports = function(jobId, callback) {
  client.lpush('scheduleJob', JSON.stringify({jobId: jobId}), callback);
};
