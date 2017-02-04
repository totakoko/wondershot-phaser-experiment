
const log = require('misc/loglevel');
log.setDefaultLevel('info');
log.getLogger('Player').setLevel('debug');
log.getLogger('Battle').setLevel('debug');
log.getLogger('Round').setLevel('debug');
log.getLogger('WeaponSlingshot').setLevel('info');
log.getLogger('PhysicsManager').setLevel('debug');

import './lib';
import './components';
import './services';
import './state';
import './Config';
import './Game';
import WS from './WS';
import './Filters';

export default WS;
