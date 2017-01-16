const async = require('async');
const isMessageValid = require('./services/isMessageValid');
const createUniqueJobId = require('./services/createUniqueJobId');
const assignWorkspace = require('./services/assignWorkspace');
const retrieveWorkflowTemplate = require('./services/retrieveWorkflowTemplate');
const initializeJob = require('./services/initializeJob');
const queueJobForScheduling = require('./services/queueJobForScheduling');

module.exports = function(job, done) {
  const payload = job.payload;
  const templateName = job.templateName;

  /**
   * Validate job: The message received should have at least a non-empty
   * payload, and the name of the workflow template.
   * If it can't, then dump it in the error queue.
   */
  if(!isMessageValid(job)) {
    done(new Error('Invalid Job. Must have at least templateName and payload'), job);
    return;
  }

  /**
   * TODO: Create unique Job ID
   */
  const jobId = createUniqueJobId();

  /**
   * TODO: Assign Workspace
   */
  const workspace = assignWorkspace(jobId);

  console.log('payload:', payload);
  console.log('templateName:', templateName);
  console.log('isMessageValid:', isMessageValid(job));
  console.log('jobId:', jobId);
  console.log('workspace:', workspace);

  async.waterfall([
    /**
     * Retrieve Workflow Template
     */
    retrieveWorkflowTemplate.bind(null, templateName),

    /**
     * Initialize all Stages in the workflow, with status: Not Started
     */
    initializeJob.bind(null, jobId, workspace, payload),

    /**
     * Identify the list of stages with resolved dependencies, and
     * schedule them.
     */
    queueJobForScheduling.bind(null, jobId)
  ], done);
}
