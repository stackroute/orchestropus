const child_process = require('child_process');

module.exports = function(workspace, callback) {
  console.log('Creating Workspace:', workspace);
  const createWorkspace = child_process.spawn('mkdir', ['-p', workspace]);
  createWorkspace.on('close', (code) => {
    console.log('Creating Workspace', workspace, 'exit code:', code);
    if(code !== 0) { callback(new Error('Problem creating workspace')); return; }
    callback(null);
  });
};
