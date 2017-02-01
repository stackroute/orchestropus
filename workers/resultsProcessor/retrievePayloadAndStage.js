const async = require('async');
const retrievePayload = require('../../services/payload/retrievePayload');
const retrieveStage = require('../../services/stages/retrieveStage');

module.exports = function(jobId, stageName, done) {
  async.parallel([
    retrievePayload.bind(null, jobId),
    retrieveStage.bind(null, jobId, stageName)
  ], (err, [payload, stage]) => {
    done(err, {payload, stage});
  });
};
