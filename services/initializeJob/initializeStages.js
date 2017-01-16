const async = require('async');
const _ = require('lodash');

const client = require('../../redisClient').duplicate();

module.exports = function(jobId, template, callback) {
  const stagesKey = jobId + ':stages'

  const newTemplate = _.cloneDeep(template);

  const keys = Object.keys(newTemplate.stages);

  async.each(keys, (key, callback) => {
    const stage = template.stages[key];
    console.log(jobId, 'Initializing Stage:', key);
    stage.status = 'NotStarted';
    stage.ts_created = new Date();
    client.hset(stagesKey, key, JSON.stringify(stage), callback);
  }, callback);
};
