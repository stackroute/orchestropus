const redis = require('redis');
const config = require('./config');

module.exports = {
  registerWorker: function(queue, worker) {
    const client = require('./redisClient').duplicate();
    client.on('ready',getMessage);

    function getMessage() {
      console.log(queue, 'Waiting for message');
      client.brpop(queue, 0, (err, reply) => {
        if(err) { console.error('Error while getting message:', err); getMessage(); return; }
        const msg = reply[1];
        console.log(queue, 'Received Message:', msg);
        try {
          console.log(queue,'msg:',msg);
          worker(JSON.parse(msg), (err) => {
            if(err) { console.error('Error in worker:', err);} // Not returning on purpose
            getMessage();
          });
        } catch (err) {
          console.log(queue, 'Data not in JSON format:', err);
          getMessage();
        }
      });
    }
  }
};
