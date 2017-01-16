const client = require('../../redisClient').duplicate();

module.exports = function(jobId, workspace, callback) {
  const contextKey = jobId + ':context';

  const context = {
    WORKSPACE: 'file://'+workspace
  };

  console.log(jobId, 'Initializing Context:', context)
  client.set(contextKey, JSON.stringify(context), callback);
};
