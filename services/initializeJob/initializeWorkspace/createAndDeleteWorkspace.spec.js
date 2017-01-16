const async = require('async');

const createWorkspace = require('./createWorkspace');
const deleteWorkspace = require('./deleteWorkspace');

const path = '/tmp/abc';

describe('initializeWorkspace', () => {
  it('delete existing directory should not throw error', (done) => {
    async.series([
      deleteWorkspace.bind(null, path),
      createWorkspace.bind(null, path),
      deleteWorkspace.bind(null, path)
    ], (err) => {
      done(err);
    });
  });
});
