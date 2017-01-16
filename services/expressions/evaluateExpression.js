const nunjucks = require('nunjucks');

module.exports = function(payload, context, expression) {
  // TODO: Handle Expression
  const obj = {}

  return nunjucks.renderString(expression, {payload: payload, context: context});
};
