const fs = require('fs')
const path = require('../utills/path')
const dir = require('../utills/directory')
const log = require('../log')
const buildHtml = require('./buildHtml')
const copydir = require('copy-dir')


const buildOutput = {
  success: [],
  failed: [],
  compilationError: []
}

/**
 * Convert source file path to target file path
 * ex: /pages/index.js => /dist/index.html 
 * ex: /pages/home.js => /dist/home/index.html 
 * @param {string} filePath
 * @returns {string}
 */
function getTargetFilePath (filePath) {
  const fileName = filePath.name
  const targetFolderPath = path.join(
    path.targetPath,
    filePath.path.replace(path.templetePath, ''))
  if (fileName === 'index.js') {
    return targetFolderPath.replace('index.js', '').replace(path.rootPath, '')
  } else {
    return targetFolderPath.replace('.js', '').replace(path.rootPath, '')
  }
}

/**
 * create recursive folder structure
 * @param {Array<string>} filePathList 
 * @param {string} rootPath 
 * @returns 
 */
function createFolder (filePathList, rootPath) {
  if (filePathList.length) {
    const folder = filePathList.shift()
    const folderPath = path.join(rootPath, folder)
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      } else {
        createFolder(filePathList, folderPath)
      }
    } catch (e) {
      log.log(e, {type: 'error'})
      return false
    }
  } else {
    return true
  }
}

/**
 * 
 * @param {object} pathConfig // {path: string, name: string}
 * @param {object} templete // {params: Array<object>, render: function}
 * @returns 
 */
function getAllPathList (pathConfig, templete) {
  const pathList = []
  pathConfig.path = getTargetFilePath(pathConfig)
  if (pathConfig.path.includes(`${path.sep}_`)) {
    const params = templete.params
    if (!params) {
      throw new Error(`Template ${pathConfig.path} can't find param object, but required`)
    }

    params.forEach((element, index) => {
      const config = {...pathConfig}
      config.param = element
      config.paramIndex = index
      config.path = config.path.split(path.sep).map(e => {
        if (e[0] === '_') {
          const key = e.substr(1,)
          if (element[key]) {
            return element[key]
          } else {
            config.error = true
            return undefined
          }
        }
        return e
      }).join(path.sep)
      if (!config.error) {
        pathList.push(config)
      } else {
        log.log(`Failed to generate path for ${config.path} because of invalid param object at ${config.paramIndex}, ${JSON.stringify(config.param)}`,
        {type: 'error'})
      }
    })
  } else {
    pathList.push(pathConfig)
  }
  return pathList
}


/**
 * Create Html file form templete object
 * @param {Array<fileObject>} pathList 
 * @param {} templete 
 */
function buildFile (pathList, templete) {
  pathList.forEach(pathConfig => {
    const targetPath = pathConfig.path
    createFolder(
      targetPath.split(path.sep).filter(e => e !== ''),
      path.rootPath)
    log.log(`Generating ${targetPath}${path.sep}index.html`, {type: 'info'})
    buildHtml.build(templete, pathConfig.param, (html) => {
      fs.writeFileSync(path.join(path.rootPath, targetPath, 'index.html'), html, {encoding:'utf8'})
    })
  })
}

/**
 * 
 * @param {object} dirStructure 
 */
function build (dirStructure) {
  dirStructure.children.forEach(e => {
    if (e.type === 'file' && e.extension === '.js') { // if Js file exist
      const localPath = e.path.replace(path.templetePath, '') // relative path of js file
      let templete = null // templete object
      try {
        templete = require(e.path)
      } catch {
        templete = null
      }
      log.log(`Started building file ${localPath}`, {type: 'info'})
      if (!templete) { // if file permisson is invalid
        log.log(`Build failed for ${localPath}`, {type: 'error'})
        log.log(`templete ${localPath} exporting null`, {type: 'error'})
        buildOutput.failed.push(localPath)
      } else if (typeof templete !== 'object') { // if templete is not correct
        log.log(`Build failed for ${localPath}`, {type: 'error'})
        log.log(`Templete ${localPath} is ${typeof templete} insted of object`, {type: 'error'})
        buildOutput.failed.push(localPath)
      } else if (typeof templete.render !== 'function') { // if it didn't have render function
        log.log(`Build failed for ${localPath}`, {type: 'error'})
        log.log(`Templete ${localPath} render is ${typeof templete.render} insted of function`, {type: 'error'})
        buildOutput.failed.push(localPath)
      } else {
        try {
          // generete all require path
          const allPathList = getAllPathList(e, templete) 
          buildFile(allPathList, templete)
          buildOutput.success.push(localPath)
        } catch (e) {
          log.log(e, {type: 'error'})
          buildOutput.compilationError.push(localPath)
        }
      }
    } else if (e.type === 'directory') {
      build(e)
    }
  })
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  
  fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
    let sourcePath = path.join(source, entry.name);
    let destinationPath = path.join(destination, entry.name);

    entry.isDirectory()
      ? copyDirectory(sourcePath, destinationPath)
      : fs.copyFileSync(sourcePath, destinationPath);
  });
}

/**
 * Build all templete file
 */
function buildAll () {
  buildOutput.success = []
  buildOutput.failed = []
  buildOutput.compilationError = []
  copydir.sync(path.staticPath, path.targetPath, {
    utimes: true,  // keep add time and modify time
    mode: true,    // keep file mode
    cover: true    // cover file when exists, default is true
  })
  const dirStructure = dir(path.templetePath, {extensions:/\.js$/})
  dirStructure && build(dirStructure)
  log.generatingBuildReport(buildOutput)
}

module.exports = {
  buildAll
}