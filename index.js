const registerWorker = require('./registerWorker');
const initializeJob = require('./workers/initializeJob');
const jobScheduler = require('./workers/jobScheduler');
const stageScheduler = require('./workers/stageScheduler');
const resultsProcessor = require('./workers/resultsProcessor');

registerWorker('qM', initializeJob);
registerWorker('scheduleJob', jobScheduler);
registerWorker('scheduleStage', stageScheduler);
registerWorker('results', resultsProcessor);
