const async = require('async');
const retrieveStageData = require('../../services/retrieveStageData');
const scheduleStage = require('./scheduleStage');

module.exports = function({jobId, stageName}, done) {
  async.waterfall([
    retrieveStageData.bind(null, jobId, stageName),
    scheduleStage.bind(null, jobId, stageName),
  ], done);
};
