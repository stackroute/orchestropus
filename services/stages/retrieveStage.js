const client = require('../../redisClient').duplicate();

module.exports = function(jobId, stageName, callback) {
  const stagesKey = jobId + ':stages';

  client.hget(stagesKey, stageName, (err, reply) => {
    if(err) { callback(err); return; }

    callback(null, JSON.parse(reply));
  });
};
