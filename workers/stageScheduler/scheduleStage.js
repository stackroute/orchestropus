const async = require('async');
const nunjucks = require('nunjucks');
const getAmqpConnection = require('../../getAmqpConnection');
const retrieveContextAndPayload = require('./retrieveContextAndPayload');
const updateStage = require('../../services/stages/updateStage');

module.exports = function (jobId, stageName, {payload, context, stage}, done) {
  const cmd = '/' + stage.type;
  const languagePackQueue = stage.type.split('/').slice(0, 2).join('/');
  if(!stage.input) { stage.input = {}; }
  if(!stage.input.WORKSPACE) { stage.input.WORKSPACE = "{{context.WORKSPACE}}"; }
  const input = getInput(stage.input, payload, context);

  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    scheduleStage.bind(null, stage, {jobId, stageName, cmd, input}, languagePackQueue)
  ], done);
}

function getInput(inputs, payload, context) {
  const input = {};

  const inputKeys = Object.keys(inputs || {});

  inputKeys.forEach((key) => {
    const value = getInputString(inputs[key], payload, context);
    input[key] = value;
  });

  return input;
}

function getInputString(string, payload, context) {
  const renderedString = nunjucks.renderString(string, {payload: payload, context: JSON.parse(context)});
  return renderedString;
}

function scheduleStage(stage, msg, queueName, channel, callback) {
  async.parallel([
    sendToLanguagePack.bind(null, msg, queueName, channel),
    updateStageData.bind(null, stage, msg)
  ], callback);
}

function sendToLanguagePack(msg, queueName, channel, callback) {
  channel.assertQueue(queueName, {durable: true});
  channel.sendToQueue(queueName, new Buffer(JSON.stringify(msg)));
  callback(null);
}

function updateStageData(stage, {jobId, stageName, cmd, input}, callback) {
  stage.actualInput = input;
  stage.status = 'Scheduled';
  stage.ts_scheduled = new Date();

  updateStage(jobId, stageName, stage, callback);
}

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, newChannel);
  });
}