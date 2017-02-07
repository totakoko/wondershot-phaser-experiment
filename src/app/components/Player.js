import _ from 'lodash';
import WS from '../WS';
const log = require('misc/loglevel').getLogger('Player'); // eslint-disable-line no-unused-vars

const PlayerSpeed = 3;

export default WS.Components.Player = class Player extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('player', 'assets/images/player.png');
        WS.game.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', 16, 16);
        WS.game.load.image('player-death-marker', 'assets/images/player-death-marker.png');
    }
    constructor(playerOptions) {
        super();
        this.playerNumber = playerOptions.playerNumber;
        this.playerColor = playerOptions.color;
        this.alive = true;

        // this.sprite = WS.game.world.create(80 * this.playerNumber, 200, 'player');
        log.debug(`Player ${this.playerNumber} starting at position ${playerOptions.startLocation.x}:${playerOptions.startLocation.y}`);
        this.sprite = WS.game.Groups.Players.create(playerOptions.startLocation.x, playerOptions.startLocation.y, 'player');
        this.sprite.scale.setTo(0.2);
        this.sprite.tint = this.playerColor.tint;
        this.sprite.data.owner = this;
        WS.game.physics.p2.enable(this.sprite, WS.Config.Debug);
        this.sprite.body.setCircle(30);
        this.sprite.body.fixedRotation = true;
        this.sprite.body.damping = 1; // pas d'effet élastique sur les côtés
        log.debug(`collision group : Player${this.playerNumber}`);
        const physics = WS.Services.PhysicsManager[`Player${this.playerNumber}`];
        this.sprite.body.setCollisionGroup(physics.id);
        this.sprite.body.collides(physics.Arena);
        this.sprite.body.collides(physics.OtherProjectiles);
        this.sprite.body.collides(physics.Objects);

        this.onKilledEvent = new WS.Phaser.Signal(); // eslint-disable-line babel/new-cap
    }
    setInput(options) {
      if (options.movement) {
        this.movement = options.movement;
      }
      if (options.fireWeapon) {
        options.fireWeapon.onDown.removeAll();
        options.fireWeapon.onDown.add(this.loadWeapon, this);
        options.fireWeapon.onUp.removeAll();
        options.fireWeapon.onUp.add(this.releaseWeapon, this);
      }
      if (options.jump) {
        options.jump.onDown.removeAll();
        options.jump.onDown.add(_.throttle(this.jump, 3000, {trailing: false}), this);
      }
      if (options.togglePauseMenu) {
        options.togglePauseMenu.onDown.removeAll();
        options.togglePauseMenu.onDown.add(_.throttle(WS.Components.PauseMenu.togglePause, 500, {trailing: false}), WS.Components.PauseMenu);
      }
    }
    update() {
      if (this.sprite.alive && this.movement && !this.jumping && !WS.game.physics.p2.paused) {
          const moveX = this.movement.axes[0];
          const moveY = this.movement.axes[1];
          if (moveX || moveY) {
              this.sprite.rotation = Math.atan2(moveY, moveX);
              this.sprite.body.x += moveX * PlayerSpeed;
              this.sprite.body.y += moveY * PlayerSpeed;
          }
      }
    }
    // Actions
    pickupWeapon(weapon) {
        log.debug(`Player ${this.playerNumber} picks up ${weapon.id}`);
        this.weapon = weapon;
        this.weapon.pickup(this);
    }
    loadWeapon() {
      if (this.loadingWeapon) {
        throw new Error("Can't load weapon again while still loading.");
      }
      this.loadingWeapon = {
        power: 0
      };
      this.loadingWeaponTween = WS.game.add.tween(this.loadingWeapon)
          .to({power: 100}, 1000, WS.Phaser.Easing.Linear.None)
          .start()
          .onUpdateCallback(() => {
            console.log('loading power', this.loadingWeapon.power);
          });
    }
    releaseWeapon() {
        if (!this.loadingWeapon) {
          throw new Error("Can't release unloaded weapon.");
        }
        this.fireWeapon(this.loadingWeapon.power);
        this.loadingWeapon = null;
        this.loadingWeaponTween.stop();
    }
    fireWeapon(power) {
        if (!this.alive) {
          log.warn(`Player ${this.playerNumber} is dead`);
          return;
        }
        if (this.weapon === null) {
            log.debug('No weapon to fire !');
            return;
        }
        log.debug(`Fire weapon ${this.weapon.constructor.name}`);
        this.weapon.fire(power);
        this.weapon = null;
    }
    jump() {
      if (!this.alive) {
        log.warn(`Player ${this.playerNumber} is dead`);
        return;
      }
      const accelerationFactor = 50000;
      const xForce = Math.cos(this.sprite.rotation) * accelerationFactor;
      const yForce = Math.sin(this.sprite.rotation) * accelerationFactor;
      log.debug(`Jump! (accel: ${xForce}:${yForce}`);

      // jumping part, the player can't control the movements
      this.jumping = true;
      const jumpingTween = WS.game.add.tween(this.sprite.body.force)
          .to({x: xForce, y: yForce}, 100, WS.Phaser.Easing.Linear.None)
          .to({x: xForce / 10, y: yForce / 10}, 150, WS.Phaser.Easing.Linear.None)
          .start();
      jumpingTween.onComplete.add(() => {
        log.debug('Jump tween complete');
        this.jumping = false;
        if (this.sprite.alive) {
          this.sprite.body.angularVelocity = 0; // TODO arranger ça avec les materials
        }
      });
    }
    kill() {
        log.info(`kill player${this.playerNumber}`);
        this.alive = false;

        const deathMarker = WS.game.Groups.Arena.create(this.sprite.x, this.sprite.y, 'player-death-marker');
        deathMarker.anchor.setTo(0.5);
        deathMarker.tint = this.playerColor.tint;
        this.sprite.destroy();
        // this.sprite.safedestroy = true;
        this.onKilledEvent.dispatch();
        WS.game.state.callbackContext.battle.notifyPlayerKilled(this.playerNumber);

        this.fireWeapon = function () {};
    }
};
