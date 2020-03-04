
const { readdirSync } = require("fs");

/**
 * Count files of working dir
 * @return {number}
 */
const countfiles = () => {
    return readdirSync(process.cwd(), "UTF-8")
        .filter(file => file !== ".dir.json")
        .length;
}

/**
 *   @type DirViewOptions {
 *       path: string
 *       timestamp: number
 *       filecount: number
 *       note: string
 *       keywords: Array<string>
 *   }
 */

/**
 * Making stream object
 * @param {string} note
 * @param {Array<string>} keywords
 * @return {DirViewOptions}
 */
module.exports = (note, keywords) => {
    return {
        path: process.cwd(),
        timestamp: Date.now(),
        filecount: countfiles(),
        note,
        keywords
    };
}