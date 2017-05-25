const async = require('async');
const identifyAndUpdateBlockedStages = require('./identifyAndUpdateBlockedStages');
const handleJobCompletion = require('./handleJobCompletion');

module.exports = function(jobId, stages, done) {
  async.waterfall([
    identifyAndUpdateBlockedStages.bind(null, jobId, stages),
    handleJobCompletion.bind(null, jobId, stages)
  ], done);
};