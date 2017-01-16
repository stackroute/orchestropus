const async = require('async');

const client = require('../../redisClient').duplicate();
const saveStage = require('../stage/saveStage');

module.exports = function(jobId, stageName, input, stage, callback) {
  async.parallel([
    updateStage.bind(null, jobId, input, stageName, stage),
    queueStageJob.bind(null, jobId, input, stage.type)
  ], callback);
};

function updateStage(jobId, input, stageName, stage, callback) {
  // Change status to scheduled
  stage.status = 'Scheduled';

  // Update Input
  stage.input = input;

  // Add ts_scheduled
  stage.ts_scheduled = new Date();

  // Save in redis
  saveStage(jobId, stageName, stage, callback);
}

function queueStageJob(jobId, input, stageType, callback) {
  const message = {};
  message.jobId = jobId;
  message.input = input;
  console.log('stageType:', stageType);
  const tokens = stageType.split('/');
  message.cmd = tokens[2];
  const nodeQueueName = tokens[0] + '/' + tokens[1];
  client.lpush(nodeQueueName, JSON.stringify(message), callback);
}
