const async = require('async');
const getAmqpConnection = require('../getAmqpConnection');
const client = require('../redisClient').duplicate();
const initializeJob = require('./initializeJob');
const stageScheduler = require('./stageScheduler');
const should = require('should');

describe('StageScheduler', () => {
  const jobId = 'abc';
  const payload = { repoUrl: 'https://github.com/expressjs/express.git', testJobId: jobId, foo: 'bar' };
  const templateName = 'gitclone.test';
  const testJobId = 'abc';
  const stageName = 'git-clone';

  before((done) => {
    const jobId = 'abc';
    async.series([
      flushDb,
      flushMQ,
      initializeJob.bind(null, {payload, templateName, testJobId}),
      stageScheduler.bind(null, {jobId: 'abc', 'stageName': 'git-clone'})
    ], done);
  });

  it('Stage is created', (done) => {
    async.waterfall([
      getAmqpConnection,
      getAmqpChannel,
      (channel, callback) => {
        channel.consume('stackroute/git', (msg) => {
          const obj = JSON.parse(msg.content.toString());
          obj.should.have.property('cmd');
          obj.cmd.should.be.exactly('/stackroute/git/clone');
          obj.should.have.property('jobId');
          obj.jobId.should.be.exactly(jobId);
          obj.should.have.property('stageName');
          obj.stageName.should.be.exactly(stageName);
          obj.should.have.property('input');
          obj.input.should.have.property('REPOSITORY_URL');
          obj.input.should.have.property('BRANCH');
          obj.input.should.have.property('FOO');
          obj.input.should.have.property('WORKSPACE');
          channel.ack(msg);
          callback();
        });
      }
    ], done);
  });

  it('Stage Status is updated to "Scheduled"', (done) => {
    const stagesKey = jobId + ':stages'
    client.hget(stagesKey, 'git-clone', (err, reply) => {
      if(err) { done(err); return; }
      const stage = JSON.parse(reply);
      stage.should.have.property('status');
      stage.status.should.be.exactly('Scheduled');
      stage.should.have.property('ts_scheduled');
      stage.should.have.property('actualInput');
      stage.actualInput.should.have.property('REPOSITORY_URL');
      stage.actualInput.should.have.property('BRANCH');
      stage.actualInput.should.have.property('FOO');
      stage.actualInput.FOO.should.be.exactly('bar');
      stage.actualInput.should.have.property('WORKSPACE');
      stage.actualInput.WORKSPACE.should.be.exactly('/tmp/abc');
      done();
    });
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
    deleteQueue.bind(null, 'stackroute/git'),
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
  /*console.log('CHANNEL:', channel);
  channel.deleteQueue(queueName);
  callback(null);*/
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
