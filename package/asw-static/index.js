const log = require('./log/index')
const build = require('./build/build')

log.log('Build Started', {type: 'info'})

// To read console argument
const argsList = process.argv.slice(2);
const args = {}
for (let i = 0; i < argsList.length; i = i + 2) {
  args[argsList[i].slice(2,)] = argsList[i+1]
}

if (!args.path) {
  // Check if user did't pass any param it will build all the file
  build.buildAll()
}