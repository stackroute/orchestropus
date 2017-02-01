const async = require('async');

const retrievePayload = require('./payload/retrievePayload');
const retrieveContext = require('./context/retrieveContext');
const retrieveStage = require('./stages/retrieveStage');

module.exports = function(jobId, stageName, done) {
  async.parallel([
    retrievePayload.bind(null, jobId),
    retrieveContext.bind(null, jobId),
    retrieveStage.bind(null, jobId, stageName)
  ], (err, [payload, context, stage]) => {
    if(err) { done(err); return; }
    done(null, {payload, context, stage});
  });
};
