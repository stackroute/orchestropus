const YAML = require('yamljs');
const path = require('path');

module.exports = function(templateName, callback) {
  const template = YAML.load(path.join(__dirname,'..','templates',templateName+'.yml'));
  callback(null, template);
}
