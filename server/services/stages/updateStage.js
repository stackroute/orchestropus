const async = require('async');
const client = require('../../redisClient').duplicate();

module.exports = function(jobId, stageName, stage, callback) {
  const stagesKey = jobId + ':stages';

  // FIXME: For correct implementation, need to Retrieve, Patch, and update, with version control checks.
  client.hset(stagesKey, stageName, JSON.stringify(stage), callback);
};
