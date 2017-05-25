const registerWorker = require('./registerWorker');
const config = require('./config');
const worker = require('./worker');

registerWorker(config.QUEUE_NAME, worker);
