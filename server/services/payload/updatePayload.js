const client = require('../../redisClient').duplicate();

module.exports = function(jobId, payloadPatch, callback) {
  const payloadKey = jobId + ':payload';

  // FIXME: For correct implementation, need to Retrieve, Patch, and update, with version control checks.
  client.set(payloadKey, JSON.stringify(payloadPatch), callback);
};
