const async = require('async');
const updateStage = require('../../services/stages/updateStage');

module.exports = function(jobId, template, callback) {
  const stageNames = Object.keys(template.stages);

  const stages = stageNames.map((stageName) => {
    const stage = template.stages[stageName];

    stage.status = 'Initialized';
    stage.ts_initialized = new Date();

    return stage;
  });

  async.eachOf(stages, (stage, index, callback) => {
    updateStage(jobId, stageNames[index], stage, callback);
  }, callback);
};
