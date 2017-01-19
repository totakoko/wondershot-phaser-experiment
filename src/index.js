// import Vue from 'vue';
// import Hello from './app/Hello.vue';

import './index.styl';

// export default new Vue({
//   el: '#root',
//   render: h => h(Hello)
// });

// import 'pixi';
// import 'p2';
// import "phaser";

import WS from './app';

window.onload = function () {
  WS.game = new WS.Game();
};
