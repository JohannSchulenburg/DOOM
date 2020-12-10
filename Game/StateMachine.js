"use strict";
var Doom;
(function (Doom) {
    var ƒaid = FudgeAid;
    class ComponentStateMachineEnemy extends ƒaid.ComponentStateMachine {
        constructor() {
            super();
            this.instructions = ComponentStateMachineEnemy.instructions;
        }
        static setupStateMachine() {
            let setup = new ƒaid.StateMachineInstructions();
            setup.setAction(Doom.JOB.PATROL, (_machine) => {
                let container = _machine.getContainer();
                // console.log(container);
                if (container.mtxLocal.translation.equals(container.posTarget, 0.1))
                    _machine.transit(Doom.JOB.IDLE);
                container.move();
            });
            setup.setTransition(Doom.JOB.PATROL, Doom.JOB.IDLE, (_machine) => {
                let container = _machine.getContainer();
                ƒ.Time.game.setTimer(3000, 1, (_event) => {
                    container.chooseTargetPosition();
                    _machine.transit(Doom.JOB.PATROL);
                });
            });
            return setup;
        }
    }
    ComponentStateMachineEnemy.instructions = ComponentStateMachineEnemy.setupStateMachine();
    Doom.ComponentStateMachineEnemy = ComponentStateMachineEnemy;
})(Doom || (Doom = {}));
//# sourceMappingURL=StateMachine.js.map