module.exports = function(msg) {
  if(msg && msg.payload && msg.templateName) return true;
  return false;
};
