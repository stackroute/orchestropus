const amqp = require('amqplib/callback_api');
const config = require('./config');

let connection = null;

module.exports = function(callback) {
  if(connection) { callback(null, connection); return; }
  amqp.connect(config.AMQP_URL, (err, newConnection) => {
    if(err) { callback(err); return; }
    connection = newConnection;
    callback(null, connection);
  });
};
