//TODO acabar
var Balas = Entity.extend(function () {
    this.currState;// estado atual;
    this.states = {
        bala:"bala",
        canhao:"canhao",
        chama:"chama",
        gelo:"gelo"
    };

    this.damage;
    this.special;
    this.speed;
    this.range;
    this.type;
    this.constructor = function (spriteSheet, x, y, type, damage, speed, range, special) {
        this.super();
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        this.damage = damage;
        this.speed = speed;
        this.range = range;
        this.special = special;
        switch (type) {
            case "cannonTower":
                this.currState = this.states.canhao;
                break;
            case "iceTower":
                this.currState = this.states.gelo;
                break;
            case "flameTower":
                this.currState = this.states.chama;
                break;
            case "sniperTower":
                this.currState = this.states.bala;
                break;
        }
        setup();

    };
    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };
    this.update = function () {
        if (!this.active) return;

        this.x -= this.vx;
        this.y -= this.vy;

        this.width = this.frames[this.currentFrame].width;
        this.height = this.frames[this.currentFrame].height;
        this.updateSize();
        this.currentFrame = (++this.currentFrame) % this.frames.length;
    };

    var setup = function () {
        this.frames = this.eStates[0];
        this.width = this.frames[0].width;
        this.height = this.frames[0].height;
    }.bind(this);

})