
const log = require('misc/loglevel');
log.setDefaultLevel('info');
log.getLogger('Arena').setLevel('debug');
log.getLogger('Battle').setLevel('debug');
log.getLogger('Player').setLevel('info');
log.getLogger('Round').setLevel('debug');
log.getLogger('WeaponSlingshot').setLevel('info');
log.getLogger('PhysicsManager').setLevel('debug');
log.getLogger('ScaleManager').setLevel('debug');

import './lib';
import './components';
import './services';
import './state';
import './Config';
import './Game';
import WS from './WS';
import './Filters';

export default WS;
