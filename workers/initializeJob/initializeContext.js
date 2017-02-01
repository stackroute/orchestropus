const path = require('path');

const config = require('../../config');
const updateContext = require('../../services/context/updateContext');

module.exports = function(jobId, callback) {
  const WORKSPACE = path.join(config.WORKSPACE_DIR, jobId);

  updateContext(jobId, {WORKSPACE}, callback);
};
