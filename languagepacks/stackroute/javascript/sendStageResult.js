const async = require('async');
const getAmqpConnection = require('./getAmqpConnection');

module.exports = function(jobId, stageName, result, done) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    sendStageResult.bind(null, jobId, stageName, result)
  ], done);
};

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
}

function sendStageResult(jobId, stageName, result, channel, callback) {
  result.jobId = jobId;
  result.stageName = stageName;
  result.ts_completed = new Date();

  async.series([
    (callback) => { channel.assertQueue('results', {durable: true}, callback); },
    (callback) => { channel.sendToQueue('results', new Buffer(JSON.stringify(result))); callback(); }
  ], callback);
}
