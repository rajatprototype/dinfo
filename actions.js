
const fs = require("fs");
const { flags } = require("./cli");
const descriptor = require("./descriptor");
const store = require("./store");
const keymap = require("./store/keymap");
const { dirname, basename, join } = require("path");

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

    // Create ~/.dinfo/gdir.json
    if (!fs.existsSync(gpath)) {
        fs.writeFileSync(gpath, "{}", "UTF-8");
    }

    // Create ~/.dinfo/keymap.json
    if (!fs.existsSync(keymap.globalkeymappath)) {
        fs.writeFileSync(keymap.globalkeymappath, "{}", "UTF-8");
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

/**
 * Print command help
 * @param {string} docname
 * @return {string}
 */
module.exports.printDoc = (docname = 'app') => {
    const path = join(__dirname, 'doc', docname.concat('.txt'));
    const content = fs.readFileSync(path, "UTF-8");
    process.stdout.write(content);
    return content;
}

/**
 * List of all keywords
 */
module.exports.getAllKeywords = () => {
    const { fgyellow, bright, reset } = require("./termtext");
    const list = keymap.entries.map(word => `${fgyellow}${bright}${word}${reset}`);

    process.stdout.write(list.join(', ').concat('\n'));
}

/**
 * List of all routes related to given keyword
 * @param {string} keyname
 */
module.exports.getRoutes = (keyname) => {
    let routes = keymap.get(keyname);
    if (!routes.length) {
        return;
    }

    const { fggreen, fgcyan, bright, reset } = require("./termtext");

    routes = routes.map((route, id) => {
        /* Formation will be
            n. [basename] /some/route/
        */
        const index = `${fggreen}${id + 1}${reset}.`,
              routestring = `${bright}${route}${reset}`,
              basestring = `${fgcyan}[${basename(route)}]${reset}`;

        // Readable form
        return [index, basestring, routestring].join(' ');
    })
    process.stdout.write(routes.join('\n').concat('\n'));
}
