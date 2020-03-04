
const { action, param, targetGlobal } = require('./cli');
const { set, get, remove, printDoc } = require("./actions");

module.exports = function() {
    switch (action) {
        case 'set':
            const [ msg, ...tags ] = param;
            set(msg, tags, targetGlobal);
            break;
        case 'remove':
            remove(targetGlobal);
            break;
        case 'help':
            const [ context ] = param;
            switch(context) {
                case 'set':
                    printDoc("set");
                    break;
                case 'remove':
                    printDoc("remove");
                    break;
                case 'app':
                default:
                    printDoc("app");
                    break;
            }
            break;
        case 'version':
            const { version } = require("./package.json");
            process.stdout.write(version.concat('\n'));
            break
        case null: 
            get(targetGlobal);
            break;
    }
}