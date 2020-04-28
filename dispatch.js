
const { action, param, targetGlobal } = require('./cli');
const actions = require("./actions");

module.exports = function() {
    switch (action) {
        case 'set':
            const [ msg, ...tags ] = param;
            actions.set(msg, tags, targetGlobal);
            break;
        case 'remove':
            actions.remove(targetGlobal);
            break;
        case 'get':
            const [ keyword ] = param;
            actions.getRoutes(keyword);
            break;
        case 'keywords':
            actions.getAllKeywords();
            break;
        case 'help':
            const [ context ] = param;
            switch(context) {
                case 'get':
                    actions.printDoc('get');
                    break;
                case 'set':
                    actions.printDoc("set");
                    break;
                case 'remove':
                    actions.printDoc("remove");
                    break;
                case 'app':
                default:
                    actions.printDoc("app");
                    break;
            }
            break;
        case 'version':
            const { version } = require("./package.json");
            process.stdout.write(version.concat('\n'));
            break
        case null: 
            actions.get(targetGlobal);
            break;
    }
}