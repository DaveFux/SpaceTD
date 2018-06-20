var refTile =Entity.extend(function () {
    this.currState = undefined; // estado atual;


    this.states = {
        UNIQUE: 'UNIQUE'
    };

    this.constructor = function (spriteSheet, x, y,width,height) {
        this.super();
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        this.currState = this.states.UNIQUE;
        this.currentFrame = 0;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
            setup();
    };

    this.update = function () {
        this.x += this.vx;
        if ((this.x) == Math.round(this.width / 3 * 2))
            this.x = 0;

    };

    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };

    var setup = function () {

        this.eStates['UNIQUE'] = this.spriteSheet.getStats('UNIQUE');
        this.frames = this.eStates[this.currState];

    }.bind(this);

    this.andar = function () {
        this.vx = 1;
    };

    this.parar = function () {
        this.vx = 0;
    };

});