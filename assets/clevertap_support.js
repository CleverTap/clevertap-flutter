const variables = {};
const onVariablesChangedCallback = {};

clevertap.defineVariables = (vars) => {
  for (var v in vars) {
    variables[v] = clevertap.defineVariable(v, vars[v]);
  }
}

clevertap.onVariablesChanged = (callback) => {
  clevertap.addVariablesChangedCallback(() => {
    const vars = {}
    for (const name in variables) {
      vars[name] = variables[name].value
    }
    console.log('sending to callback', JSON.stringify(vars))
    callback(vars)
  })
}

clevertap.onValueChanged = (key, callback) => {
  variables[key].addValueChangedCallback((v) => callback({ [key]: v.value }));
}

clevertap.getVariables = (callback) => {
  const vars = {}
  console.log({variables})
  for (const name in variables) {
    vars[name] = variables[name].value
  }
  callback(vars)
}

clevertap.getVariable = (name, callback) => {
  callback(variables[name].value)
}
