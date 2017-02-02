import './lib';
import './components';
import './services';
import './state';
import './Config';
import './Game';
import WS from './WS';
import './Filters';

const log = require('loglevel');
log.setDefaultLevel('info');
log.getLogger('Player').setLevel('debug');
log.getLogger('Battle').setLevel('debug');
log.getLogger('WeaponSlingshot').setLevel('debug');
log.getLogger('PhysicsManager').setLevel('debug');

export default WS;
