const async = require('async');
const getAmqpConnection = require('../../getAmqpConnection');

module.exports = function(jobId, callback) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    scheduleJob.bind(null, jobId)
  ], callback);
};

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
};

function scheduleJob(jobId, channel, callback) {
  channel.assertQueue('scheduleJob', {durable: true});
  // console.log('CHANNEL:', channel);
  // console.log('JOB_ID:', jobId);
  channel.sendToQueue('scheduleJob', new Buffer(JSON.stringify({jobId})), {persistent: true});
  callback(null);
};
