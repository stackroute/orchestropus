const async = require('async');

const updatePayload = require('./updatePayload');
const updateStage = require('./updateStage');
const retrievePayloadAndStage = require('./retrievePayloadAndStage');
const scheduleJob = require('../../services/job/scheduleJob');

module.exports = function({jobId, stageName, stdout, stderr, exitCode}, done) {
  retrievePayloadAndStage(jobId, stageName, (err, {payload, stage}) => {
    async.parallel([
      updatePayload.bind(null, jobId, stageName, stage, payload, exitCode, stdout),
      updateStage.bind(null, jobId, stageName, stage, exitCode, stdout, stderr)
    ], (err, results) => {
      if(err) { done(err); return; }
      scheduleJob(jobId, done);
    });
  });
};
