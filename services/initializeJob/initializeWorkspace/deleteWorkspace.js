const child_process = require('child_process');

module.exports = function(workspace, callback) {
  console.log('Deleting workspace:', workspace);
  const deleteWorkspace = child_process.spawn('rm', ['-rf', workspace]);
  deleteWorkspace.on('close', (code) => {
    console.log('Deleting workspace:', workspace, 'exit code:', code);
    if(code !== 0) { callback(new Error('Problem deleting workspace')); return; }
    callback(null);
  });
};
