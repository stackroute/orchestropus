const client = require('../../redisClient').duplicate();

module.exports = function(jobId, stageName, stage, callback) {
  const stageKey = jobId + ':stages';
  console.log('stageKey, stageName:', stageKey, stageName);
  client.hset(stageKey, stageName, JSON.stringify(stage), callback);
};
