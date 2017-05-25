const async = require('async');
const nunjucks = require('nunjucks');
nunjucks.configure({autoescape: false});
const _ = require('lodash');
const retrievePayload = require('../../services/payload/retrievePayload');
const savePayload = require('../../services/payload/updatePayload');

module.exports = function(jobId, stageName, stage, payload, exitCode, stdout, done) {
  if(exitCode !== 0) { done(null); return; }

  if(!stage.hasOwnProperty('output')
      || !stage.output.hasOwnProperty('payload')) {
    done(null); return;
  }

  const OUTPUT = stdout;
  /*try {
    OUTPUT = JSON.parse(stdout);
  } catch (err) {
    OUTPUT = stdout;
  }*/

  const payloadString = JSON.stringify(stage.output.payload);
  const payloadPatch = nunjucks.renderString(payloadString, {OUTPUT});

  _.merge(payload, JSON.parse(payloadPatch));

  // FIXME: Send only patch, when supported by services/payload/updatePayload.js
  savePayload(jobId, payload, done);
};
