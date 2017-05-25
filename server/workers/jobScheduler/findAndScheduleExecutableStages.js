const async = require('async');
const filterExecutableStages = require('./filterExecutableStages');
const scheduleStages = require('./scheduleStages');

module.exports = function(jobId, stages, done) {
  async.waterfall([
    filterExecutableStages.bind(null, stages),
    scheduleStages.bind(null, jobId)
  ], done);
};
