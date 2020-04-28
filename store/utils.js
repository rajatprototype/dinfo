const { readFileSync, writeFileSync } = require("fs");

/**
 * Read and parse content of source
 * @param {string} path 
 * @return {object}
 */
module.exports.read = (path) => JSON.parse(readFileSync(path, "UTF-8"));

/**
 * Write object to source file
 * @param {string} path
 * @param {object} obj 
 * @return {object}
 */
module.exports.writeSource = (path, obj) => {
  return writeFileSync(path, JSON.stringify(obj, undefined, 3), "UTF-8" ) || obj;
}