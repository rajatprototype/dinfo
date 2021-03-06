
const fs = require("fs");
const { join } = require("path");
const keymap = require("./keymap");
const { homedir } = require("os");
const { read, writeSource } = require("./utils");

/**
 * Global store path
 * @type {Getter} globalpath
 * @return {string}
 */
module.exports.__defineGetter__('globalpath', 
    () => join(homedir(), ".dinfo/gdir.json")
);

/**
 * Local store path
 * @type {Getter} cpath
 * @return {string}
 */
module.exports.__defineGetter__('cpath', 
    () => join(process.cwd(), ".dir.json")
);

/**
 * Existence of .dir.json in current dir
 * @type {Getter} inLocal
 * @return {boolean}
 */
module.exports.__defineGetter__('inLocal', 
    () => fs.existsSync(this.cpath)
);

/**
 * Existence of ~/.dir-desc/gdir.json 
 * @type {Getter} existsGlobal
 * @return {boolean}
 */
module.exports.__defineGetter__('existsGlobal', 
    () => fs.existsSync(this.globalpath)
);

/**
 * Make a query to global store
 * @param {string} query
 * @return {object}
 */
module.exports.findInGlobal = (query = process.cwd()) => {
    if (this.existsGlobal) {
        const res = read(this.globalpath);
        if (query in res)
            return res[query];
    }
    return null;
}

/**
 * Access metadata of current directory
 * @param {boolean} fromGlobal false
 * @return {object}
 */
module.exports.get = (fromGlobal = false) => {
    if (!fromGlobal) {
        return (this.inLocal)? read(this.cpath): null;
    }
    return this.findInGlobal() || null;
}

/**
 * Write object to a local file
 * @param {object} metadata
 * @param {boolean} toGlobal false
 * @return {object}
 */
module.exports.write = (metadata, toGlobal = false) => {
    if (!toGlobal) {
        // Replacement of source
        return writeSource(this.cpath, metadata) || metadata;
    } else {
        // For insertion
        let obj = read(this.globalpath) || {};
        const { path, keywords } = metadata;

        // register keywords
        if (keywords.length) {
            keymap.add(path, keywords);
        }

        // Push new object entry
        obj = Object.assign(obj, {
            [path]: metadata
        });
        

        return writeSource(this.globalpath, obj) || metadata;
    }
}

/**
 * Unlink store reference
 * @param {boolean} fromGlobal
 * @return {object}
 */
module.exports.remove = (fromGlobal = false) => {
    if (!fromGlobal) {
        // Remove local store
        return (this.inLocal)? fs.unlinkSync(this.cpath): null;
    } else {
        if (this.existsGlobal) {
            const res = read(this.globalpath);
            const prop = Object.keys(res).find(key => key === process.cwd());
            delete(res[prop]);
            return writeSource(this.globalpath, res) || res;
        }
    }
    return null;
}