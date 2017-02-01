const child_process = require('child_process');
const config = require('./config');
const _ = require('lodash');

module.exports = function(cmd, input, iii, callback) {
  cmd = config.CMD_PREFIX + cmd;
  const cmdProcess = child_process.spawn(cmd, {env: _.merge(input, process.env)});

  let stdout = '';
  cmdProcess.stdout.on('data', (data) => {
    console.log(cmd,'STDOUT:', data.toString());
    stdout += data.toString();
  });

  let stderr = '';
  cmdProcess.stderr.on('data', (data) => {
    console.log(cmd,'STDERR:', data.toString());
    stderr += data.toString();
  });

  cmdProcess.on('close', (exitCode) => {
    console.log('Process exited with code:', exitCode);
    callback(null, {stdout, stderr, exitCode});
  });
};
