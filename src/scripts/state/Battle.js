let PauseMenu = WS.Components.PauseMenu,
    ScoreBoard = WS.Components.ScoreBoard,
    Projectiles = WS.Components.Projectiles,
    PlayerManager = WS.Components.PlayerManager,
    World = WS.Components.World,
    CollisionManager = WS.Services.CollisionManager,
    Weapon = WS.Components.Weapon;

const Battle = WS.State.Battle = class Battle extends Phaser.State {
    create() {
        this.components = [
            new PauseMenu(),
            new ScoreBoard(),
            new World(),
            new PlayerManager(),
            new Weapon(),
        ];
        WS.game.time.advancedTiming = true;
        WS.game.physics.startSystem(Phaser.Physics.P2JS);
        WS.game.physics.p2.setImpactEvents(true); // TODO pas sûr que ça soit utile
        // WS.game.physics.p2.applyGravity = false; // TODO pas encore besoin a priori
        //  4 trues = the 4 faces of the world in left, right, top, bottom order
        // WS.game.physics.p2.setWorldMaterial(WS.game.worldMaterial, true, true, true, true);
        this.initGroups();
        CollisionManager.createCollisionGroups();
        CollisionManager.createMaterials();
        //       this.stage.disableVisibilityChange = false; // met en pause le jeu si focus perdu et le reprends quand focus back
        for (let component of this.components) {
            if (component.create) {
                component.create();
            }
        }
    }
    initGroups() {
        // triés par z-index
        WS.game.Groups = {};
        WS.game.Groups.Game = WS.game.add.group(WS.game.world, 'game');
        WS.game.Groups.Floor = WS.game.add.group(WS.game.Groups.Game, 'floor');
        WS.game.Groups.Objects = WS.game.add.group(WS.game.Groups.Game, 'objects');
        WS.game.Groups.Players = WS.game.add.group(WS.game.Groups.Game, 'players');
        WS.game.Groups.Projectiles = WS.game.add.group(WS.game.Groups.Game, 'projectiles');
        WS.game.Groups.UI = WS.game.add.group(WS.game.Groups.Game, 'ui');
        WS.game.Groups.Menus = WS.game.add.group(WS.game.world, 'menus');
    }
    update() {
        for (let component of this.components) {
            if (component.update) {
                component.update();
            }
        }
    }
    pauseUpdate() {
        // permet de mettre à jour les gamepad pour sortir de la pause
        if (WS.game.input.gamepad && WS.game.input.gamepad.active) {
            WS.game.input.gamepad.update();
        }
    }
    render() {
        for (let component of this.components) {
            if (component.render) {
                component.render();
            }
        }
        // FPS
        WS.game.debug.text(WS.game.time.fps, WS.game.world.width - 25, 14, "#f00");
    }
}
