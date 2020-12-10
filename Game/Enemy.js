"use strict";
var Doom;
(function (Doom) {
    var ƒ = FudgeCore;
    var ƒaid = FudgeAid;
    let ANGLE;
    (function (ANGLE) {
        ANGLE[ANGLE["_000"] = 0] = "_000";
        ANGLE[ANGLE["_045"] = 1] = "_045";
        ANGLE[ANGLE["_090"] = 2] = "_090";
        ANGLE[ANGLE["_135"] = 3] = "_135";
        ANGLE[ANGLE["_180"] = 4] = "_180";
        ANGLE[ANGLE["_225"] = 5] = "_225";
        ANGLE[ANGLE["_270"] = 6] = "_270";
        ANGLE[ANGLE["_315"] = 7] = "_315";
    })(ANGLE = Doom.ANGLE || (Doom.ANGLE = {}));
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
    })(JOB = Doom.JOB || (Doom.JOB = {}));
    //const mtrWhite: ƒ.Material = new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("white")));
    //const mtrGrey: ƒ.Material = new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("slategrey")));
    //const inner: ƒAid.Node = new ƒAid.Node("Inner", ƒ.Matrix4x4.IDENTITY(), mtrWhite, new ƒ.MeshPyramid());
    //const outer: ƒAid.Node = new ƒAid.Node("Outer", ƒ.Matrix4x4.IDENTITY(), mtrGrey, new ƒ.MeshPyramid());
    class Enemy extends ƒ.Node {
        constructor(_name = "Enemy", _position) {
            super(_name);
            this.speed = 3;
            this.cmpAudio = new ƒ.ComponentAudio(new ƒ.Audio("../DoomAssets/hypnotic.mp3"), true);
            this.angleView = 0;
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = _position;
            this.cmpAudio.setPanner(ƒ.AUDIO_PANNER.CONE_OUTER_ANGLE, 180);
            this.cmpAudio.setPanner(ƒ.AUDIO_PANNER.CONE_INNER_ANGLE, 30);
            this.addComponent(this.cmpAudio);
            this.show = new ƒaid.Node("Show", ƒ.Matrix4x4.IDENTITY());
            this.appendChild(this.show);
            this.sprite = new ƒaid.NodeSprite("Sprite");
            this.sprite.addComponent(new ƒ.ComponentTransform());
            this.show.appendChild(this.sprite);
            this.sprite.setAnimation(Enemy.animations["Idle_000"]);
            this.sprite.setFrameDirection(1);
            this.sprite.framerate = 2;
            let cmpStateMachine = new Doom.ComponentStateMachineEnemy();
            this.addComponent(cmpStateMachine);
            cmpStateMachine.stateCurrent = JOB.PATROL;
            this.chooseTargetPosition();
            // this.appendChild(new ƒaid.Node("Cube", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("Cube", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("red"))), new ƒ.MeshCube()));
        }
        static generateSprites(_spritesheet) {
            Enemy.animations = {};
            for (let angle = 0; angle < 5; angle++) {
                let name = "Idle" + ANGLE[angle];
                let sprite = new ƒaid.SpriteSheetAnimation(name, _spritesheet);
                sprite.generateByGrid(ƒ.Rectangle.GET(44 + angle * 107, 33, 63, 66), 3, 32, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.Y(100));
                Enemy.animations[name] = sprite;
            }
        }
        update() {
            this.getComponent(Doom.ComponentStateMachineEnemy).act();
            this.displayAnimation();
            //let panner: ƒ.Mutator = this.cmpAudio.getMutatorOfNode(ƒ.AUDIO_NODE_TYPE.PANNER);
            {
                //let sin: number = Math.sin(Math.PI * <number>panner["coneInnerAngle"] / 360);
                //let cos: number = Math.cos(Math.PI * <number>panner["coneInnerAngle"] / 360);
                //this.mtxInner.set(ƒ.Matrix4x4.IDENTITY());
                //this.mtxInner.scaling = new ƒ.Vector3(2 * sin, 2 * sin, cos);
            }
            {
                //let sin: number = Math.sin(Math.PI * <number>panner["coneOuterAngle"] / 360);
                //let cos: number = Math.cos(Math.PI * <number>panner["coneOuterAngle"] / 360);
                //this.mtxOuter.set(ƒ.Matrix4x4.IDENTITY());
                //this.mtxOuter.scaling = new ƒ.Vector3(2 * sin, 2 * sin, cos);
            }
        }
        move() {
            this.mtxLocal.showTo(this.posTarget);
            this.mtxLocal.translateZ(this.speed * ƒ.Loop.timeFrameGame / 1000);
        }
        chooseTargetPosition() {
            let range = Doom.sizeWall * Doom.numWalls / 2 - 2;
            this.posTarget = new ƒ.Vector3(ƒ.Random.default.getRange(-range, range), 0, ƒ.Random.default.getRange(-range, range));
            console.log("New target", this.posTarget.toString());
            let enemyAudio = this.getComponent(ƒ.ComponentAudio);
            enemyAudio.play(true);
        }
        displayAnimation() {
            this.show.mtxLocal.showTo(ƒ.Vector3.TRANSFORMATION(Doom.avatar.mtxLocal.translation, this.mtxWorldInverse, true));
            let rotation = this.show.mtxLocal.rotation.y;
            rotation = (rotation + 360 + 22.5) % 360;
            rotation = Math.floor(rotation / 45);
            if (this.angleView == rotation)
                return;
            this.angleView = rotation;
            if (rotation > 4) {
                rotation = 8 - rotation;
                this.flip(true);
            }
            else
                this.flip(false);
            let section = ANGLE[rotation];
            this.sprite.setAnimation(Enemy.animations["Idle" + section]);
        }
        flip(_reverse) {
            this.sprite.mtxLocal.rotation = ƒ.Vector3.Y(_reverse ? 180 : 0);
        }
    }
    Doom.Enemy = Enemy;
})(Doom || (Doom = {}));
//# sourceMappingURL=Enemy.js.map