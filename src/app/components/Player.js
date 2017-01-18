import WS from '../';
const pauseMenu = WS.Components.PauseMenu;

export default class Player extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('player', 'assets/images/player.png');
        WS.game.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', 16, 16);
        WS.game.load.image('player-death-marker', 'assets/images/player-death-marker.png');
    }
    constructor(playerOptions) {
        super();
        this.playerNumber = playerOptions.playerNumber;
        this.playerColor = playerOptions.color;
        this.pad = playerOptions.pad;
        this.alive = true;


        this.indicator = WS.game.Groups.UI.create(10 + (40 * (this.playerNumber - 1)), 10, 'controller-indicator');
        this.indicator.scale.setTo(2);
        this.indicator.animations.frame = 1;

        // this.sprite = WS.game.world.create(80 * this.playerNumber, 200, 'player');
        console.log(`Player ${this.playerNumber} starting at position ${playerOptions.startLocation.x}:${playerOptions.startLocation.y}`);
        this.sprite = WS.game.world.create(playerOptions.startLocation.x, playerOptions.startLocation.y, 'player');
        this.sprite.scale.setTo(0.2);
        this.sprite.tint = this.playerColor.tint;
        this.sprite.data.owner = this;
        WS.game.physics.p2.enable(this.sprite, WS.Config.Debug);
        this.sprite.body.setCircle(30);
        this.sprite.body.fixedRotation = true;
        this.sprite.body.damping = 1; // pas d'effet élastique sur les côtés
        console.log('collision group : Player' + this.playerNumber);
        this.sprite.body.setCollisionGroup(WS.Services.PhysicsManager['Player' + this.playerNumber].id);
        this.sprite.body.collides(WS.Services.PhysicsManager['Player' + this.playerNumber].World);
        this.sprite.body.collides(WS.Services.PhysicsManager['Player' + this.playerNumber].OtherProjectiles);
        this.sprite.body.collides(WS.Services.PhysicsManager['Player' + this.playerNumber].Objects);

        this.registerGamepadButtons();
    }
    registerGamepadButtons() {
        console.log('registerGamepadButtons player%s', this.playerNumber);
        // TODO tester plusieurs ajouts de callback
        for (const keyName of [Phaser.Gamepad.XBOX360_A, Phaser.Gamepad.XBOX360_START]) {
          this.pad.getButton(keyName).onDown.removeAll();
        }
        this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(this.fireWeapon, this);
        this.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(_.throttle(pauseMenu.togglePause, 500, { trailing: false }), pauseMenu);
    }
    update() {
      if (this.pad.connected && this.sprite.alive) {
          let moveX = this.pad._rawPad.axes[0];
          let moveY = this.pad._rawPad.axes[1];
          if (moveX || moveY) {
              this.sprite.rotation = Math.atan2(moveY, moveX);
              this.sprite.body.x += moveX * WS.Config.PlayerSpeed;
              this.sprite.body.y += moveY * WS.Config.PlayerSpeed;
          }
      }
      this.indicator.animations.frame = this.pad.connected ? 0 : 1;
    }

    // Actions
    pickupWeapon(weapon) {
        console.log(`Player ${this.playerNumber} picks up ${weapon.id}`);
        this.weapon = weapon;
        this.weapon.pickup(this);
    }
    fireWeapon() {
        if (this.weapon == null) {
            console.log('No weapon to fire !');
            return;
        }
        console.log(`Fire weapon ${this.weapon.constructor.name}`)
        this.weapon.fire();
        this.weapon = null;
    }
    kill() {
        console.log('kill player%s', this.playerNumber);
        this.alive = false;

        const deathMarker = WS.game.Groups.Floor.create(this.sprite.x, this.sprite.y, 'player-death-marker');
        deathMarker.anchor.setTo(0.5);
        deathMarker.tint = this.playerColor.tint;
        this.sprite.destroy();
        // this.sprite.safedestroy = true;
        //TODO utiliser safedestroy = true
        WS.game.state.callbackContext.battle.addPoint(this.playerNumber);

        this.fireWeapon = function() {};
    }
}
