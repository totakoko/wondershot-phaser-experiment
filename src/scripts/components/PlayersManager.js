const PlayerManager = WS.Components.PlayerManager = class PlayerManager extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('player', 'assets/images/player.png');
        WS.game.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', 16, 16);
        WS.game.load.image('player-death-marker', 'assets/images/player-death-marker.png');
    }
    constructor() {
        super();
        this.players = {};
        this.activePlayers = [1, 2, 3, 4];
    }
    create() {
        WS.game.input.gamepad.start();
        if (!WS.game.input.gamepad.supported) {
            WS.game.destroy();
            throw new Error(`The Gamepad API not supported in this browser!`);
        }
        // la connexion est gamepad est faite en asynchrone
        WS.game.input.gamepad.onConnectCallback = this.onGamepadConnect.bind(this);
        this.activePlayers.forEach(function (playerNumber) {
            let player = this.players[playerNumber] = new WS.Components.Player(playerNumber);
            player.pickupWeapon(new WS.Components.WeaponSlingshot());
        }, this);
    }
    onGamepadConnect(gamepadNumber) {
        let playerNumber = gamepadNumber + 1;
        console.log('Gamepad%s connected.', playerNumber);
        this.players[playerNumber].registerGamepadButtons();
    }
    update() {
        if (WS.game.input.gamepad.active) {
            this.updatePadIndicators();
            this.updatePlayerPositions();
        }
    }
    updatePadIndicators() {
        this.activePlayers.forEach(function (playerNumber) {
            if (this.players[playerNumber].pad.connected) {
                this.players[playerNumber].indicator.animations.frame = 0;
            }
            else {
                this.players[playerNumber].indicator.animations.frame = 1;
            }
        }, this);
    }
    updatePlayerPositions() {
        this.activePlayers.forEach(function (playerNumber) {
            let pad = this.players[playerNumber].pad;
            if (pad.connected) {
                let moveX = pad._rawPad.axes[0];
                let moveY = pad._rawPad.axes[1];
                if (moveX || moveY) {
                    let playerSprite = this.players[playerNumber].sprite;
                    playerSprite.rotation = Math.atan2(moveY, moveX);
                    playerSprite.body.x += moveX * WS.Config.PlayerSpeed;
                    playerSprite.body.y += moveY * WS.Config.PlayerSpeed;
                }
            }
        }, this);
    }
    killPlayer(player) {
        console.log('kill player%s', player.playerNumber);
        WS.Components.ScoreBoard.addPoint(player.playerNumber);
        deathMarker = WS.game.Groups.Floor.create(player.sprite.x, player.sprite.y, 'player-death-marker');
        deathMarker.anchor.setTo(0.5);
        deathMarker.tint = WS.Config.PlayerColors[player.playerNumber];
        // this.sprite.scale.setTo(0.2);
        this.players[player.playerNumber].sprite.destroy();
        delete this.activePlayers[player.playerNumber - 1];
    }
}
