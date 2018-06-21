var refTile =Entity.extend(function () {
    this.currState = undefined; // estado atual;
    this.type=undefined;
    this.ativo=false
    this.states = {
        ending: 'ending',
        spawn: 'spawn'
    };

    this.constructor = function (spriteSheet, x, y,width,height,type) {
        this.super();
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        this.currentFrame = 0;
        this.type=type;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;


        switch (type){
            case "ending":
                this.currState = this.states.ending;
                console.log(this.currState)
                break;
            case "spawn":
                this.currState = this.states.spawn;
                console.log(this.currState)
                break;
        }
            setup();

        };

    this.update = function () {
        this.x += this.vx;
        if ((this.x) == Math.round(this.width / 3 * 2))
            this.x = 0;

    };//por enquanto e inutil

    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };

    var setup = function () {

        this.eStates[this.currState] = this.spriteSheet.getStats(this.currState);
        this.frames = this.eStates[this.currState];

    }.bind(this);


});