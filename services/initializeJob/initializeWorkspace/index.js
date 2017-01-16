const async = require('async');

const deleteWorkspace = require('./deleteWorkspace');
const createWorkspace = require('./createWorkspace');

module.exports = function(workspace, callback) {
  async.series([
    deleteWorkspace.bind(null, workspace),
    createWorkspace.bind(null, workspace)
  ], callback);
};
