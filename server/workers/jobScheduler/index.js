const async = require('async');

const retrieveAllStages = require('../../services/stages/retrieveAllStages');
const findAndScheduleExecutableStages = require('./findAndScheduleExecutableStages');
const identifyAndUpdateBlockedStagesAndHandleJobCompletion = require('./identifyAndUpdateBlockedStagesAndHandleJobCompletion');

module.exports = function({jobId}, done) {
  console.log('JOB_SCHEDULER STARTING:', jobId);
  retrieveAllStages(jobId, (err, stages) => {
    if(err) { done(err); return; }
    async.parallel([
      findAndScheduleExecutableStages.bind(null, jobId, stages),
      identifyAndUpdateBlockedStagesAndHandleJobCompletion.bind(null, jobId, stages)
    ], done);
  });
};
