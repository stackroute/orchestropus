const should = require('should');
const async = require('async');

const getAmqpConnection = require('../getAmqpConnection');
const client = require('../redisClient').duplicate();

const initializeJob = require('./initializeJob');

describe('InitializeJob', () => {
  const jobId = 'abc';
  const payload = { repoUrl: 'https://github.com/expressjs/express.git', testJobId: jobId };
  const templateName = 'gitclone.test';

  before((done) => {
    async.series([
      flushDb,
      initializeJob.bind(null, {payload, templateName})
    ], done);
  });

  it('Payload is created', (done) => {
    const payloadKey = jobId + ':payload';

    client.get(payloadKey, (err, replyString) => {
      if(err) { done(err); return; }
      const reply = JSON.parse(replyString);
      reply.should.have.property('repoUrl');
      reply.repoUrl.should.be.exactly(payload.repoUrl);
      done();
    });
  });

  it('Context is created', (done) => {
    const contextKey = jobId + ':context';

    client.get(contextKey, (err, replyString) => {
      if(err) { done(err); return; }
      const reply = JSON.parse(replyString);
      reply.should.have.property('WORKSPACE');
      reply.WORKSPACE.should.be.exactly('/workspaces/abc');
      done();
    });
  });

  it('Stages are created', (done) => {
    const stagesKey = jobId + ':stages';

    client.hgetall(stagesKey, (err, replyMap) => {
      if(err) { done(err); return; }
      const reply = convertHgetReplyToObject(replyMap);
      Object.keys(reply).length.should.be.exactly(1);
      reply['git-clone'].should.have.property('ts_initialized');
      reply['git-clone'].should.have.property('status');
      reply['git-clone'].status.should.be.exactly('Initialized');
      done();
    });
  });
});

function sendToQm(payload, channel, callback) {
  channel.assertQueue('qM', {durable: false});

  channel.sendToQueue('qM', new Buffer(JSON.stringify(payload)));
  callback();
}

function convertHgetReplyToObject(replyMap) {
  const reply = {};

  Object.keys(replyMap).forEach((item) => {
    reply[item] = JSON.parse(replyMap[item]);
  });

  return reply;
}

function flushDb(callback) {
  client.flushdb(callback);
};
