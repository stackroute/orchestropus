const async = require('async');

const retrievePayload = require('../../services/payload/retrievePayload');
const retrieveContext = require('../../services/context/retrieveContext');

module.exports = function(jobId, done) {
  async.parallel([
    retrievePayload.bind(null, jobId),
    retrieveContext.bind(null, jobId)
  ], (err, results) => {
    if(err) { done(err); return; }
    const payload = results[0];
    const context = results[1];
    done(null, {payload, context});
  });
};
