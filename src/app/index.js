import './lib';
import './components';
import './services';
import './state';
import './Config';
import './Game';
import WS from './WS';

const log = require('loglevel');
log.setDefaultLevel('info');
log.getLogger('battle').setLevel('debug');

export default WS;
