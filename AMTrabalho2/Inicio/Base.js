var Torre = Entity.extend(function () {
        this.currState = undefined;
        this.states = {
            UNIQUE: 'UNIQUE'
        };

        this.constructor = function (spriteSheet, x, y, type) {
            this.super();
            this.x = x;
            this.y = y;
            this.spriteSheet = spriteSheet;

            switch (type) {
                case "cannonTower":
                    this.speed = 5;
                    this.damage = 50;
                    this.range = 2;
                    this.currState = this.states.turret6;
                    break;
                case "iceTower":
                    this.speed = 0;
                    this.damage = 10;
                    this.range = 1;
                    this.special = "slow";
                    this.currState = this.states.turret1;
                    break;
                case "flameTower":
                    this.speed = 1;
                    this.damage = 25;
                    this.range = 1;
                    this.special = "burn";
                    this.currState = this.states.turret7;
                    break;
                case "sniperTower":
                    this.speed = 9;
                    this.damage = 100;
                    this.range = 3;
                    this.currState = this.states.turret2;
                    break;
            }
            this.currentFrame = 0;
            setup();
        };

        var setup = function () {
            this.eStates[this.currState] = this.spriteSheet.getStats(this.currState);
            this.frames = this.eStates[this.currState];
            this.width = this.frames[0].width;
            this.height = this.frames[0].height;
        }.bind(this);


        this.getSprite = function () {
            return this.frames[this.currentFrame];
        };


    }
);