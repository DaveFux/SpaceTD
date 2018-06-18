var Spawn = Entity.extend(function () {
    this.ativo=false
    this.constructor = function (spriteSheet, x, y){
        this.super();
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
    }
    var setup = function () {
        this.eStates[this.currState] = this.spriteSheet.getStats(this.currState);
        this.frames = this.eStates[this.currState];
        this.width = this.frames[0].width;
        this.height = this.frames[0].height;
    }.bind(this);

});