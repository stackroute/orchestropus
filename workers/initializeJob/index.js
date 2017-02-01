const nid = require('nid');
const async = require('async');
const retrieveTemplate = require('../../services/template/retrieveTemplate');

const initializeContext = require('./initializeContext');
const initializePayload = require('./initializePayload');
const initializeStages = require('./initializeStages');
const scheduleJob = require('../../services/job/scheduleJob');

module.exports = function({payload, templateName}, callback) {
  const jobId = payload.testJobId || nid(8);

  retrieveTemplate(templateName, (err, template) => {
    if(err) { callback(err); return; }

    async.parallel([
      initializeContext.bind(null, jobId),
      initializePayload.bind(null, jobId, payload),
      initializeStages.bind(null, jobId, template),
    ],(err, results) => {
      if(err) { callback(err); return null; }
      scheduleJob(jobId, callback);
    });
  });
};
