const async = require('async');

const initializeWorkspace = require('./initializeWorkspace');
const initializePayload = require('./initializePayload');
const initializeContext = require('./initializeContext');
const initializeStages = require('./initializeStages');

module.exports = function(jobId, workspace, payload, template, callback) {
  async.parallel([
    // TODO: Initialize Workspace
    initializeWorkspace.bind(null, workspace),

    // TODO: Initialize Payload
    initializePayload.bind(null, jobId, payload),

    // TODO: Initialize Context
    initializeContext.bind(null, jobId, workspace),

    // TODO: Initialize Stages
    initializeStages.bind(null, jobId, template)
  ],(err) => {
    if(err) { callback(err); return; }
    callback(null);
  });
};
