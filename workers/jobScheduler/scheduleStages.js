const async = require('async');
const scheduleStage = require('../../services/stages/scheduleStage');

module.exports = function(jobId, stageNames, callback) {
  async.each(stageNames, scheduleStage.bind(null, jobId), callback);
};
