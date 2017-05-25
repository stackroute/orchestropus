const saveStage = require('../../services/stages/updateStage');

module.exports = function(jobId, stageName, stage, exitCode, stdout, stderr, done) {
  stage.ts_completed = new Date();

  const result = {}
  result.stdout = stdout;
  result.stderr = stderr;
  result.exitCode = exitCode;
  stage.status = exitCode === 0 ? 'Completed' : 'Failed';
  stage.result = result;

  saveStage(jobId, stageName, stage, done);
};
