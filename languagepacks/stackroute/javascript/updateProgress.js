const async = require('async');
const client = require('./redisClient').duplicate();
const retrieveStage = require('./services/stages/retrieveStage');
const updateStage = require('./services/stages/updateStage');

module.exports = function(jobId, stageName, done) {
  async.waterfall([
    retrieveStage.bind(null, jobId, stageName),
    (stage, callback) => {
      stage.status = 'Started';
      stage.ts_started = new Date();
      callback(null, stage);
    },
    updateStage.bind(null, jobId, stageName)
  ], done);
};
