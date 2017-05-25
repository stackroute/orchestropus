const async = require('async');
const gitCloneWorker = require('./worker');
const getAmqpConnection = require('./getAmqpConnection');
const retrieveStage = require('./services/stages/retrieveStage');
const client = require('./redisClient');
const should = require('should');

describe('stackroute/git', () => {
  describe('clone', () => {
    const jobId = 'xyz';
    const stageName = 'git-clone';
    const cmd = '/stackroute/git/clone';
    const input = {
      REPOSITORY_URL: 'https://github.com/stackroute/vagrant-xenial64-node7-mongo3.2.git',
      BRANCH: 'master',
      WORKSPACE: '/tmp/xyz'
    };
    const stage = {
      type: 'stackroute/git/clone',
      input: {
        REPOSITORY_URL: '{{payload.repoUrl}}',
        BRANCH: '{{payload.branch}}',
        WORKSPACE: '{{context.WORKSPACE}}'
      },
      status: 'Scheduled'
    };

    before(function (done) {
      this.timeout(5000);
      async.parallel([
        flushMQ,
        flushDb,
        deleteDirectory.bind(null, input.WORKSPACE),
        createStateData.bind(null, stageName, stage),
        gitCloneWorker.bind(null, { jobId, stageName, cmd, input })
      ], done);
    });

    it('Redis State is updated', (done) => {
      retrieveStage(jobId, stageName, (err, stage) => {
        stage.should.have.property('status');
        stage.status.should.be.exactly('Started');
        stage.should.have.property('ts_started');
        done();
      });
    });

    it('Result is sent', (done) => {
      async.waterfall([
        getAmqpConnection,
        getAmqpChannel,
        (channel, callback) => {
          channel.consume('results', (msg) => {
            const result = JSON.parse(msg.content.toString());
            result.should.have.property('stdout');
            result.should.have.property('stderr');
            result.should.have.property('exitCode');
            result.should.have.property('ts_completed');
            result.exitCode.should.be.exactly(0);
            channel.ack(msg);
            done();
          });
        }
      ], done);
    });

    after(function() {
      async.parallel([
        flushMQ,
        flushDb,
        closeChannel,
        deleteDirectory.bind(null, input.WORKSPACE)
      ], () => {  });
    });
  });
});

function deleteDirectory(dir, callback) {
  proc = require('child_process').spawn('rm', ['-rf', dir]);
  proc.on('close', (exitCode) => { if(exitCode === 0) { callback(null); } else { callback(new Error('Deleting Errors')); } })
}

function createStateData(stageName, stage, callback) {
  const data = JSON.stringify(stage);
  client.hset('xyz:stages', stageName, data, callback);
};

function flushDb(callback) {
  client.flushdb(callback);
};

function flushMQ(callback) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    deleteQueue.bind(null, 'stackroute/git'),
    deleteQueue.bind(null, 'results'),
  ], (err, result) => {
    if(err) { callback(err); return; }
    callback();
  });
}

function deleteQueue(queueName, channel, callback) {
  channel.deleteQueue(queueName, null, (err, ok) => {
    callback(err, channel);
  });
}

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
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
