"use strict";
const path = require('path');
const rootPath = path.join(__dirname, '..', '..', '..');
const configPath = path.join(rootPath, 'asw-static.config.json');
const tempConfig = require('../asw-static.temp.config');
let userConfig;
try {
    userConfig = require(configPath);
}
catch (_a) {
    userConfig = {};
}
const applicationConfig = Object.assign(Object.assign({}, tempConfig), userConfig);
module.exports = {
    sep: path.sep,
    rootPath,
    configPath,
    applicationConfig,
    templetePath: path.join(rootPath, applicationConfig.srcPath, applicationConfig.templetePath),
    targetPath: path.join(rootPath, applicationConfig.target),
    logPath: path.join(rootPath, applicationConfig.logs),
    staticPath: path.join(rootPath, applicationConfig.srcPath, applicationConfig.static),
    /**
     * 
     * @param  {...any} arg // relative folders list
     * @returns {string} // path of folder
     */
    getPath: (...arg) => {
        return path.join(rootPath, ...arg)
    },
    join: path.join
};
