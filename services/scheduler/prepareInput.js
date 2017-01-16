const evaluateExpression = require('../expressions/evaluateExpression');

module.exports = function(jobId, payload, context, stage, callback) {
  if(!stage.inputs) { stage.inputs = {}; }
  const input = {};

  const contextKeys = Object.keys(context);
  contextKeys.forEach((key) => {
    input[key] = evaluateExpression(payload, context, context[key]);
  });

  const inputKeys = Object.keys(stage.inputs);
  inputKeys.forEach((key) => {
    input[key] = evaluateExpression(payload, context, stage.inputs[key]);
  });

  callback(null, input, stage);
};
