const async = require('async');
const getAmqpConnection = require('../../getAmqpConnection');

module.exports = function(jobId, stageName, callback) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    scheduleStage.bind(null, jobId, stageName)
  ], callback);
};

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, newChannel);
  });
}

function scheduleStage(jobId, stageName, channel, callback) {
  channel.assertQueue('scheduleStage', { durable: true });
  channel.sendToQueue('scheduleStage', new Buffer(JSON.stringify({jobId, stageName})));
  callback(null);
}
