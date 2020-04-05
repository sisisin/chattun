const { isProduction } = require('./env');

module.exports.log = (text, isSensitive = false) => {
  const shouldLog = !(isProduction && isSensitive)
  if (shouldLog) {
    console.log(text);
  }
};
