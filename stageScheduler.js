const async = require('async');

const retrieveStagePayloadAndContext = require('./services/scheduler/retrieveStagePayloadAndContext');
const prepareInput = require('./services/scheduler/prepareInput');
const scheduleStage = require('./services/scheduler/scheduleStage');

module.exports = function({jobId, stageName}, callback) {
  async.waterfall([
    retrieveStagePayloadAndContext.bind(null, jobId, stageName),
    prepareInput.bind(null, jobId),
    scheduleStage.bind(null, jobId, stageName)
  ], callback);
};
