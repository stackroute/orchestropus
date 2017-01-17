const async = require('async');
const client = require('./redisClient').duplicate();

module.exports = function({jobId}, done) {
  // Retrieve Stages
  retrieveStages(jobId, (err, stages) => {
    if(err) { return done(err); }

    // Extract Stage Names
    const stageNames = Object.keys(stages);

    // Filter NotStarted Stages
    const notStartedStageNames = stageNames.filter((stageName) => {
      const stage = stages[stageName];
      return stage.status === 'NotStarted';
    });

    // Invoke job completion if there are 0 NotStarted jobs.
    if(notStartedStageNames.length === 0) { /*TODO: Complete Job*/ completeJob(jobId); done(); return; }

    // Filter Schedulable Stages
    const schedulableStageNames = notStartedStageNames.filter((stageName) => {
      const stage = stages[stageName];
      if(!stage.depends_on) { stage.depends_on = []; }
      console.log('depends_on:', stage.depends_on);
      const schedulable = stage.depends_on.every((dependencyName) => {
        const dependency = stages[dependencyName];
        return dependency.status === 'Complete';
      });
      return schedulable;
    });

    if(schedulableStageNames.length === 0) { done(); return; }

    // Schedule Stages
    async.each(schedulableStageNames, (stageName) => {
      client.lpush('scheduleStage', JSON.stringify({jobId, stageName}));
    }, done);
  });
};

function retrieveStages(jobId, callback) {
  const stagesKey = jobId + ':stages';
  client.hgetall(stagesKey, (err, reply) => {
    if(err) { callback(err); return; }

    const keys = Object.keys(reply);

    const obj = {};

    keys.forEach((key) => {
      obj[key] = JSON.parse(reply[key]);
    });

    callback(null, obj);
  });
}