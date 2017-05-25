const client = require('../../redisClient').duplicate();

module.exports = function(jobId, done) {
  const payloadKey = jobId + ':payload';

  client.get(payloadKey, (err, reply) => {
    if(err) { return done(err); }
    done(null, JSON.parse(reply));
  });
};
