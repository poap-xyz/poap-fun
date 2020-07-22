function getEnvVariable(name) {
  if (!process.env[name]) {
    console.error(`ENV variable ${name} is required`);
    process.exit(1);
  }
  return process.env[name];
}

module.exports = {
  getEnvVariable
};
