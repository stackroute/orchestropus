const client = require('../../redisClient').duplicate();

module.exports = function(jobId, payload, callback) {
  const payloadKey = jobId + ':payload';
  console.log(jobId + ':', 'Initializing Payload: ', payload);
  client.set(payloadKey, JSON.stringify(payload), callback);
};
