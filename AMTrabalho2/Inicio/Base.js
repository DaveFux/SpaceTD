var Base = Entity.extend(function () {
        this.currState = undefined;
        this.preco=5;
        this.states = {
            UNIQUE: 'UNIQUE'
        };

        this.constructor = function (spriteSheet, x, y) {
            this.super();
            this.x = x;
            this.y = y;
            this.spriteSheet = spriteSheet;
            this.currState=this.states.UNIQUE;
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