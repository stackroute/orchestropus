const client = require('../../redisClient').duplicate();

module.exports = function(jobId, callback) {
  const contextKey = jobId + ':context';

  client.get(contextKey, (err, reply) => {
    const context = JSON.parse(reply);
    callback(null, reply);
  });
};
