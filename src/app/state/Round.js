import Phaser from 'phaser';
import _ from 'lodash';
import WS from '../WS';
const log = require('misc/loglevel').getLogger('Round'); // eslint-disable-line no-unused-vars

export default WS.State.Round = class Round extends Phaser.State {
    init(stateOptions) {
        this.battle = stateOptions.battle;
    }
    create() {
        log.info('create');
        WS.Services.PhysicsManager.init();

        this.battle.reset();

        this.pauseMenu = new WS.Components.PauseMenu();
        this.battle.stage.register(this.pauseMenu);
        const arena = new WS.Components.Arena();
        this.battle.stage.register(arena);

        // positions triées pour être dépilées simplement
        this.startLocations = _.chain(arena.getStartPositions()).shuffle().value();
        if (this.battle.players.length > this.startLocations.length) {
          throw new Error(`The world has only ${this.startLocations.length} start locations while there are ${this.activePlayers.length} active players.`);
        }

        this.players = {};
        _.each(this.battle.players, player => {
          this[`assign${player.type}Player`](player.id);
        });

        const letsFightText = WS.game.add.bitmapText(-WS.game.world.centerX, WS.game.world.centerY, 'desyrel', "Let's fight!", 72);
        letsFightText.anchor.setTo(0.5);

        this.textAnimation = WS.game.add.tween(letsFightText)
          .to({
            x: WS.game.world.centerX,
          }, 500, WS.Phaser.Easing.Elastic.Out, false, 300)
          .to({
            x: 3 * WS.game.world.centerX,
          }, 500, WS.Phaser.Easing.Elastic.In, false, 300)
          .start();

        WS.Services.PhysicsManager.pause();
        setTimeout(() => {
          letsFightText.destroy();
          WS.Services.PhysicsManager.resume();
        }, 1600);
        for (let i = 0; i < 4; i++) {
          this.battle.stage.register(new WS.Components[this.getRandomWeapon()]({
            owner: null,
            position: {
              x: _.random(WS.Services.ScaleManager.xp(25), WS.Services.ScaleManager.xp(75)),
              y: _.random(WS.Services.ScaleManager.yp(45), WS.Services.ScaleManager.yp(55)),
            }
          }));
        }
    }
    getRandomWeapon() {
      return (_.random(0, 2) % 2 === 0) ? 'WeaponSlingshot' : 'WeaponHammer';
    }
    assignGamepadPlayer(playerNumber) {
      const player = this.createPlayer(playerNumber);
      player.setInput(new WS.Lib.Input.GamepadInput({
        pad: WS.Services.PadManager.getGamepad(playerNumber),
      }));
    }
    assignKeyboardPlayer(playerNumber) {
      const player = this.createPlayer(playerNumber);
      player.setInput(new WS.Lib.Input.KeyboardInput());
    }
    assignBotPlayer(playerNumber) {
      const player = this.createPlayer(playerNumber);
      player.setInput(new WS.Lib.Input.BotInput({
        player: player,
      }));
    }
    createPlayer(playerNumber) {
      const player = this.players[playerNumber] = new WS.Components.Player({
        playerNumber: playerNumber,
        color: WS.Config.PlayerColors[playerNumber],
        startLocation: this.getNextStartLocation(),
      });
      const weapon = new WS.Components[this.getRandomWeapon()]({
        owner: player,
      });
      player.pickupWeapon(weapon);
      this.battle.stage.register(weapon);
      this.battle.stage.register(player);
      return player;
    }
    getNextStartLocation() {
      return this.startLocations.splice(0, 1)[0];
    }
    update() {
        this.battle.stage.update();
    }
    pauseUpdate() {
        this.battle.stage.pauseUpdate();
    }
    render() {
        this.battle.stage.render();
        // FPS
        WS.game.debug.text(WS.game.time.fps, WS.game.world.width - 25, 14, "#f00");
    }
    shutdown() {
      log.info('shutdown');
    }

};
