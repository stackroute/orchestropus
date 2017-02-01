const updatePayload = require('../../services/payload/updatePayload');

module.exports = function(jobId, payload, callback) {
  const payloadKey = jobId + ':payload';

  updatePayload(jobId, payload, callback);
};
