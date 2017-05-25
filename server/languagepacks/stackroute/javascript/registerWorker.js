const async = require('async');
const getAmqpConnection = require('./getAmqpConnection');

module.exports = function(queue, worker) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    (channel, callback) => {
      channel.assertQueue(queue, {durable: true});
      channel.prefetch(1);
      channel.consume(queue, (msgBuffer) => {
        try {
          const msg = JSON.parse(msgBuffer.content.toString());
          worker(msg, (err) => {
            if(err) { channel.nack(msgBuffer); return; }
            channel.ack(msgBuffer);
          });
        } catch(err) {
          console.log('Discarding message:', msgBuffer.content.toString());
          console.error('ERR:', err);
          channel.ack(msgBuffer);
        }
      });
    }
  ]);

  let channel = null;
  function getAmqpChannel(connection, callback) {
    if(channel) { callback(null, channel); return; }
    connection.createChannel((err, newChannel) => {
      if(err) { callback(err); return; }
      channel = newChannel;
      callback(null, channel);
    });
  }
};
