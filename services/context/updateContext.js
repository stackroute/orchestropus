const client = require('../../redisClient').duplicate();

module.exports = function(jobId, contextPatch, callback) {
  const contextKey = jobId + ':context';

  // FIXME: For correct implementation, need to Retrieve, Patch, and update, with version control checks.
  client.set(contextKey, JSON.stringify(contextPatch), callback);
};
