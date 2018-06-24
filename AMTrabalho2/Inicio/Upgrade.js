var Upgrade = Entity.extend(function () {
    this.currState;// estado atual;
    this.states = {
        Um:"Um",
        Dois:"Dois",
        Max:"Max"
    };
    this.nUpgrade=0;
    this.constructor = function (spriteSheet, x, y,nUpgrade) {
        this.super();
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        this.nUpgrade=nUpgrade;
        switch (nUpgrade) {
            case 1:
                this.currState = this.states.Um;
                break;
            case 2:
                this.currState = this.states.Dois;
                break;
            case 3:
                this.currState = this.states.Max;
                break;
            
        }
        setup();

    };
    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };
    this.update = function () {
        if (!this.active) return;

        this.width = this.frames[this.currentFrame].width;
        this.height = this.frames[this.currentFrame].height;
    };

    var setup = function () {
        this.eStates[this.currState] = this.spriteSheet.getStats(this.currState);
        this.frames = this.eStates[this.currState];
        this.width = this.frames[0].width;
        this.height = this.frames[0].height;
    }.bind(this);

})