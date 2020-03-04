
const fs = require("fs");
const { flags } = require("./cli");
const descriptor = require("./descriptor");
const store = require("./store");
const { dirname, join } = require("path");

/**
 * Build readable string depending on cli flag
 * @param {Array<string>} flags 
 * @param {object} data 
 * @return {string}
 */
const buildReadableString = (flags, data) => {
    const { 
        bright, 
        dim,  
        fggreen, 
        fgwhite,
        fgcyan, 
        reset } = require("./termtext");

    let readable = `${bright}${fgwhite}${data.note}${reset}`; // For top priority

    for (const flag of flags) {
        switch(flag) {
            case '-d':
            case '--date':
                // [date]: note
                readable = `${fggreen}${dim}[${new Date(data.timestamp).toLocaleString()}]${reset}: ${readable}`;
                break;
            case '-k':
            case '--keywords':
                // note (tag1, tag2, ...)
                readable = `${readable} ${fgcyan}(${data.keywords && data.keywords.join(', ') || ""})${reset}`;
                break;
        }
    }
    return readable;
}

module.exports.initSetup = () => {
    const gpath = store.globalpath;
    const basedir = dirname(gpath);
    // Making working dir
    if (!fs.existsSync(basedir)) {
        fs.mkdirSync(basedir);
    }
    if (!fs.existsSync(gpath)) {
        fs.writeFileSync(gpath, "{}", "UTF-8");
    }
}

/**
 * Generate end result
 * @param {boolean} fromGlobal
 * @return {string}
 */
module.exports.get = (fromGlobal = false) => {
    const { note, timestamp, keywords } = store.get(fromGlobal) || {};
    let res = null;

    if (note) {
        res = buildReadableString(flags, {
            note, timestamp, keywords
        });
    }

    if (res) {
        process.stdout.write(`${res}\n`);
    }
    return res;
}

/**
 * Create or update store
 * @param {string} note
 * @param {Array<string>} keywords
 * @param {boolean} toGlobal
 * @return {object}
 */
module.exports.set = (note, keywords, toGlobal = false) => {
    return store.write(descriptor(note, keywords), toGlobal);  
}

/**
 * Remove store or object entry
 * @param {boolean} fromGlobal
 * @return {object}
 */
module.exports.remove = (fromGlobal = false) => {
    return store.remove(fromGlobal);
}

module.exports.printDoc = (docname = 'app') => {
    const path = join('doc', docname.concat('.txt'));
    const content = fs.readFileSync(path, "UTF-8");
    process.stdout.write(content);
    return content;
}