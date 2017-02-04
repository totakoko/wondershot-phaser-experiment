const log = require('loglevel');
// simplification de https://github.com/NatLibFi/loglevel-message-prefix/blob/master/lib/main.js
// qui ne fonctionne pas avec webpack (Can't resolve 'json' in '/home/maxime/src/wondershot/node_modules/loglevel-message-prefix/lib')
const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
  return originalFactory(methodName, logLevel, loggerName).bind(null, `[${new Date().toTimeString().split(' ')[0]} ${methodName.toUpperCase()} ${loggerName}]:`);
};
module.exports = log;
