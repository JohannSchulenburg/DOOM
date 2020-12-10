"use strict";
var Doom;
(function (Doom) {
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super(...arguments);
            this.health = 100;
            this.score = 0;
            this.ammo = 34;
        }
        reduceMutator(_mutator) { }
    }
    Doom.GameState = GameState;
    Doom.gameState = new GameState();
    class Hud {
        static start() {
            let domHud = document.querySelector("div#hud");
            Hud.controller = new ƒui.Controller(Doom.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    Doom.Hud = Hud;
})(Doom || (Doom = {}));
//# sourceMappingURL=Hud.js.map