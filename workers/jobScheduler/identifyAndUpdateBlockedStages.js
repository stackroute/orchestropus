const async = require('async');
const updateStage = require('../../services/stages/updateStage');

module.exports = function(jobId, stages, done) {
  const stageNames = Object.keys(stages);

  // Identify Failed Stages
  const blockedOrFilteredStageNames = stageNames.filter((stageName) => {
    const stage = stages[stageName];
    return stage.status === 'Blocked' || stage.status === 'Failed';
  });

  // Recursively identify blocked stages
  async.series([
    updateStages.bind(null, jobId, stages, blockedOrFilteredStageNames),
    recursivelyIdentifyBlockedStages.bind(null, jobId, blockedOrFilteredStageNames, stages)
  ], done);
};

function recursivelyIdentifyBlockedStages(jobId, blockedStageNames, stages, done) {
  const stageNames = Object.keys(stages);

  console.log('BlockedStageNames:', blockedStageNames);

  if(blockedStageNames.length === 0) { done(); return }

  const newlyBlockedStageNames = stageNames.filter((stageName) => {
    if(stages[stageName].status !== 'Initialized') { return false; }
    if(!stages[stageName].depends_on) { stages[stageName].depends_on = []; }
    const hasNoFailedDependency = stages[stageName].depends_on.every((dependentStageName) => {
      return blockedStageNames.indexOf(dependentStageName) < 0;
    });
    return !hasNoFailedDependency;
  });

  newlyBlockedStageNames.forEach((stageName) => {
    stages[stageName].status = 'Blocked';
  });

  updateStages(jobId, stages, blockedStageNames, (err) => {
    if(err) { done(err); return; }
    recursivelyIdentifyBlockedStages(jobId, newlyBlockedStageNames, stages, done);
  });
}

function updateStages(jobId, stages, blockedStageNames, done) {
  console.log('Updating Stages:', blockedStageNames);
  async.each(blockedStageNames, (stageName, callback) => {
    console.log('Updating Stage:', stageName);
    updateStage(jobId, stageName, stages[stageName], callback);
  }, done);
}
