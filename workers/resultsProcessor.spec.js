const async = require('async');
const getAmqpConnection = require('../getAmqpConnection');
const retrieveStage = require('../services/stages/retrieveStage');
const updateStage = require('../services/stages/updateStage');
const retrievePayload = require('../services/payload/retrievePayload');
const updatePayload = require('../services/payload/updatePayload');
const resultsProcessor = require('./resultsProcessor');
const client = require('../redisClient');
const should = require('should');

describe('ResultsProcessor', () => {
  const jobId = 'pqr';
  const stageName = 'whitebox';
  const payload = {
    foo: 'bar'
  };
  const result = {
    jobId,
    stageName,
    stdout: '{"bar":"baz"}',
    stderr: '',
    exitCode: 0
  };
  const stage = {
    type: 'stackroute/javascript/mocha',
    input: {
      INCLUDE: '**/*.spec.js'
    },
    output: {
      payload: {
        output: {
          whitebox: "{{OUTPUT | replace('\"','\\\"')}}"
        }
      }
    },
    status: 'Started'
  };

  before(function (done) {
    async.series([
      flushMQ,
      flushDb,
      updateStage.bind(null, jobId, stageName, stage),
      updatePayload.bind(null, jobId, payload),
      resultsProcessor.bind(null, result)
    ], done);
  });

  it('passing', (done) => {
    done();
  });

  it('Payload is updated', (done) => {
    async.waterfall([
      retrievePayload.bind(null, jobId),
      (payload, callback) => {
        payload.should.have.property('output');
        payload.output.should.have.property('whitebox');
        const whitebox = JSON.parse(payload.output.whitebox);
        whitebox.should.have.property('bar');
        whitebox.bar.should.be.exactly('baz');
        done();
      }
    ]);
  });

  it('Stage is updated', (done) => {
    async.waterfall([
      retrieveStage.bind(null, jobId, stageName),
      (stage, callback) => {
        stage.should.have.property('result');
        stage.result.should.have.property('stdout');
        stage.result.should.have.property('stderr');
        stage.result.should.have.property('exitCode');
        stage.status.should.be.exactly('Completed');
        callback();
      }
    ], done);
  });

  it('Job is re-scheduled', (done) => {
    async.waterfall([
      getAmqpConnection,
      getAmqpChannel,
      (channel, callback) => {
        channel.consume('scheduleJob', (msgBuffer) => {
          const msg = JSON.parse(msgBuffer.content.toString());
          msg.should.have.property('jobId');
          msg.jobId.should.be.exactly(jobId);
          callback();
        });
      }
    ], done);
  });
});

function flushDb(callback) {
  client.flushdb(callback);
};

function flushMQ(callback) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    deleteQueue.bind(null, 'results'),
    deleteQueue.bind(null, 'scheduleJob')
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
