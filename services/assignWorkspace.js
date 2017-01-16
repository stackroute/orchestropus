const config = require('../config');
const path = require('path');

module.exports = function(jobId) {
  return path.join(config.workspaceSuffix, jobId);
}
