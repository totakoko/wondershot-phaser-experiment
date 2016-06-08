var Wondershot;
(function (Wondershot) {
    var Components;
    (function (Components) {
        var World = (function () {
            function World(game) {
                this.game = game;
            }
            World.prototype.create = function () {
            };
            World.prototype.update = function () {
            };
            return World;
        }());
        Components.World = World;
    })(Components = Wondershot.Components || (Wondershot.Components = {}));
})(Wondershot || (Wondershot = {}));
