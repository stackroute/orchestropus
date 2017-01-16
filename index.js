const jobManager = require('./jobManager');
const startJob = require('./startJob');
const jobScheduler = require('./jobScheduler');
const stageScheduler = require('./stageScheduler');

jobManager.registerWorker('qM', startJob);
jobManager.registerWorker('scheduleJob', jobScheduler);
jobManager.registerWorker('scheduleStage', stageScheduler);

// TODO: Handle CompleteJob
// jobManager.registerWorker('completeJob', completeJob);

// TODO: Handle Result