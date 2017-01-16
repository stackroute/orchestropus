const client = require('../../redisClient').duplicate();

module.exports = function(jobId, stageName, callback) {
  const stageKey = jobId + ':stages';
  client.hget(stageKey, stageName, (err, reply) => {
    if(err) { callback(err); return; }
    callback(null, JSON.parse(reply));
  });
};