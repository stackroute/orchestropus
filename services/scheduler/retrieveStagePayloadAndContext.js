const async = require('async');
const client = require('../../redisClient').duplicate();

module.exports = function(jobId, stageName, callback) {
  async.parallel([
    retrievePayload.bind(null, jobId),
    retrieveContext.bind(null, jobId),
    retrieveStage.bind(null, jobId, stageName)
  ], (err, results) => {
    console.log('payload, context, stage', results);
    callback(null, results[0], results[1], results[2]);
  });
};

function retrievePayload(jobId, callback) {
  const payloadKey = jobId + ':payload';
  console.log('payloadKey:', payloadKey);
  client.get(payloadKey, (err, reply) => {
    console.log('reply:', reply);
    if(err) { callback(err); return; }
    callback(null, JSON.parse(reply));
  });
}

function retrieveContext(jobId, callback) {
  const contextKey = jobId + ':context';
  client.get(contextKey, (err, reply) => {
    if(err) { callback(err); return; }
    callback(null, JSON.parse(reply));
  });
}

function retrieveStage(jobId, stageName, callback) {
  const stageKey = jobId + ':stages';
  client.hget(stageKey, stageName, (err, reply) => {
    if(err) { callback(err); return; }
    callback(null, JSON.parse(reply));
  });
}