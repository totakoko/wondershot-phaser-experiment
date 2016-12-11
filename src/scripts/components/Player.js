const pauseMenu = WS.Components.PauseMenu;

const Player = WS.Components.Player = class Player extends WS.Lib.Entity {
    constructor(playerNumber) {
        super();
        this.playerNumber = playerNumber;
        this.playerColor = WS.Config.PlayerColors[playerNumber];
        this.pad = WS.game.input.gamepad['pad' + this.playerNumber];
        this.indicator = WS.game.Groups.UI.create(10 + (40 * (this.playerNumber - 1)), 10, 'controller-indicator');
        this.indicator.scale.setTo(2);
        this.indicator.animations.frame = 1;
        this.sprite = WS.game.world.create(80 * this.playerNumber, 200, 'player');
        this.sprite.scale.setTo(0.2);
        this.sprite.tint = WS.Config.PlayerColors[this.playerNumber];
        this.sprite.data.owner = this;
        WS.game.physics.p2.enable(this.sprite, WS.Config.Debug);
        this.sprite.body.setCircle(30);
        this.sprite.body.fixedRotation = true;
        this.sprite.body.damping = 1; // pas d'effet élastique sur les côtés
        console.log('collision group : Player' + playerNumber);
        this.sprite.body.setCollisionGroup(WS.Services.CollisionManager['Player' + playerNumber].id);
        this.sprite.body.collides(WS.Services.CollisionManager['Player' + playerNumber].World);
        this.sprite.body.collides(WS.Services.CollisionManager['Player' + playerNumber].OtherProjectiles);
    }
    registerGamepadButtons() {
        console.log('registerGamepadButtons player%s', this.playerNumber);
        this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(_.throttle(this.fireWeapon, 5, { trailing: false }), this);
        // this.pad.getButton(Phaser.Gamepad.XBOX360_B).onDown.add(_.throttle(this.throwRock, 5, { trailing: false }), this);
        this.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(_.throttle(pauseMenu.togglePause, 500, { trailing: false }), pauseMenu);
    }
    // Actions
    pickupWeapon(weapon) {
        this.weapon = weapon;
        this.weapon.setOwner(this);
    }
    fireWeapon() {
        if (this.weapon == null) {
            console.log('no weapon !');
            return;
        }
        this.weapon.fire();
    }
}
