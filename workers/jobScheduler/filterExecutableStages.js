module.exports = function(stages, callback) {
  const stageNames = Object.keys(stages);
  const executableStages = stageNames.filter((stageName) => {
    const stage = stages[stageName];

    if(stage.status !== 'Initialized') { return false; }

    const dependencyNames = stage.depends_on;
    if(!dependencyNames || dependencyNames.length === 0) { return true; }

    return dependencyNames.every((dependencyName) => {
      const dependency = stages[dependencyName];

      return dependency.status === 'Completed';
    });
  });

  callback(null, executableStages);
};
