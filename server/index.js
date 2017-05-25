const express = require('express');
const async = require('async');
const config = require('./config');
const getAmqpConnection = require('./getAmqpConnection');

const registerWorker = require('./registerWorker');
const initializeJob = require('./workers/initializeJob');
const jobScheduler = require('./workers/jobScheduler');
const stageScheduler = require('./workers/stageScheduler');
const resultsProcessor = require('./workers/resultsProcessor');

registerWorker('qM', initializeJob);
registerWorker('scheduleJob', jobScheduler);
registerWorker('scheduleStage', stageScheduler);
registerWorker('results', resultsProcessor);

const app = express();
app.use(require('body-parser').json());
app.post('/api/v1/jobs', (req, res) => {
  console.log('Payload:', req.body);

  if(!req.body.templateName) {
    res.status(400).send('Request requires templateName');
    return;
  }

  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    (channel, callback) => {
      channel.assertQueue('qM', { durable: true });
      channel.sendToQueue('qM', new Buffer(JSON.stringify(req.body)), null);
      callback();
    }
  ], (err) => {
    if(err) { console.log('ERR: ', err); res.status(500).send('Could not create job.'); return; }
    res.send("Created");
  });
});

const port = config.PORT || 3000;
app.listen(port, () => {
  console.log('Express server listening on port: ', port);
});

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
}
