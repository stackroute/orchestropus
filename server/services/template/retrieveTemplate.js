const fs = require('fs');
const config = require('../../config');
const path = require('path');
const YAML = require('yamljs');

module.exports = function(templateName, callback) {
  const templatePath = path.join(__dirname, '..', '..', 'templates', templateName + '.yml');

  fs.readFile(templatePath, 'utf-8', (err, template) => {
    if(err) { callback(err); return; }
    callback(null, YAML.parse(template));
  });
};
