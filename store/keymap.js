const { homedir } = require("os");
const { join } = require("path");
const { read, writeSource } = require("./utils");

/**
 * Global keymap path
 * @type {Getter} globalkeymappath
 * @return {string}
 */
module.exports.__defineGetter__('globalkeymappath', 
  () => join(homedir(), ".dinfo/keymap.json")
);

/**
 * Keyword entries
 * @type {Getter} entries
 * @return {Array<string>}
 */
module.exports.__defineGetter__('entries', 
  () => Object.keys(read(this.globalkeymappath))
);

/**
 * Get keymap store
 * @return {object}
 */
const getKeydata = () => read(this.globalkeymappath);

/**
 * Get route list of following keyword
 * @param {string} keyname ''
 * @return {Array<string>}
 */
module.exports.get = (keyname = '') => {
  if (!keyname.length) {
    return []
  }
  const keystore = getKeydata();

  return Reflect.get(keystore, keyname) || [];
}

/**
 * Add new keyword entry to global store
 * @param {string} pathname null
 * @param {Array<string>} keynames []
 * @return {string}
 */
module.exports.add = (pathname = null, keynames = []) => {
  if (!(keynames.length && pathname)) {
    return null;
  }
  const keydata = getKeydata();

  // Each keyword follow same dir path
  keynames.forEach((keyname) => {
    if(!Reflect.has(keydata, keyname)) {
      // New entry
      Reflect.set(keydata, keyname, [pathname]);
    } else {
      if (keydata[keyname].indexOf(pathname) === -1) {
        // Push to old one
        keydata[keyname].push(pathname)
      }
    }
  })
  writeSource(this.globalkeymappath, keydata);
  return pathname;
}


