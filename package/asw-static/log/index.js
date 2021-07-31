const chalk = require('chalk')
const path = require('../utills/path')
const fs = require('fs')


/**
 * Print in cosole as well in dedicated log file
 * @param  {String} message
 * @param  {Object} config // {type: error | success | warning | default(info)}
 */
function log (message, config = {}) {
  const type = `${new Date().toString().substr(0, 24)} [${(config.type && config.type.toUpperCase()) || 'INFO'}]: `
  fs.appendFile(path.logPath, type + message + '\n', () => {})
  if (config.type === 'success') {
    console.log(chalk.green(type) + message)
  } else if (config.type === 'warning') {
    console.log(chalk.yellow(type) + message)
  } else if (config.type === 'error') {
    console.log(chalk.red(type) + message)
  } else {
    console.log(chalk.blueBright(type) + message)
  }
}

/**
 * Generated build report on console not in log file
 * @param {object} buildObj // {failed: Array, success: Array, compilationError: Array}
 */
function generatingBuildReport (buildObj) {
  const total = buildObj.success.length + buildObj.failed.length + buildObj.compilationError.length
  console.log(chalk.blueBright.bold('Build Report'))
  console.log(chalk.red.bold(`\n\t Failed ${buildObj.failed.length}/${total}`))
  buildObj.failed.forEach(e => console.log(chalk.red('\t\t' + e)))
  console.log(chalk.red.bold(`\n\t Compilation Error ${buildObj.compilationError.length}/${total}`))
  buildObj.compilationError.forEach(e => console.log(chalk.red('\t\t' + e)))
  console.log(chalk.green.bold(`\n\t SUCCESS ${buildObj.success.length}/${total}`))
  buildObj.success.forEach(e => console.log(chalk.greenBright('\t\t' + e)))
}

module.exports = {
  log,
  generatingBuildReport
}