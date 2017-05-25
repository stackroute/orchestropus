const async = require('async');
const getAmqpConnection = require('../getAmqpConnection');
const client = require('../redisClient').duplicate();
const initializeJob = require('./initializeJob');
const jobScheduler = require('./jobScheduler');
const should = require('should');

describe('JobScheduler', () => {
  const jobId = 'abc';
  const payload = { repoUrl: 'https://github.com/expressjs/express.git', testJobId: jobId };
  const templateName = 'gitclone.test';
  const testJobId = 'abc';

  before((done) => {
    const jobId = 'abc';
    async.series([
      flushDb,
      flushMQ,
      initializeJob.bind(null, {payload, templateName, testJobId}),
      jobScheduler.bind(null, {jobId})
    ], done);
  });

  it('Stage is created', (done) => {
    async.waterfall([
      getAmqpConnection,
      getAmqpChannel,
      (channel, callback) => {
        channel.consume('scheduleStage', (msg) => {
          const obj = JSON.parse(msg.content.toString());
          obj.should.have.property('jobId');
          obj.jobId.should.be.exactly('abc');
          obj.should.have.property('stageName');
          obj.stageName.should.be.exactly('git-clone');
          channel.ack(msg);
          done();
        });
      }
    ], done);
  });
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

function flushMQ(callback) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    deleteQueue.bind(null, 'scheduleJob'),
    deleteQueue.bind(null, 'scheduleStage')
  ], (err, result) => {
    if(err) { callback(err); return; }
    callback();
  });
}

function flushDb(callback) {
  client.flushdb(callback);
};

function deleteQueue(queueName, channel, callback) {
  channel.deleteQueue(queueName, null, (err, ok) => {
    callback(err, channel);
  });
}

function closeChannel(done) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    (channel, callback) => { channel.close(); callback(); }
  ], (err, results) => {
    done(err, results);
  });
}
