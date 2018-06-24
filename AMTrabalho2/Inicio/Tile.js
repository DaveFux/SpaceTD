var Tile =Entity.extend(function () {
    this.temBase=false;
    this.temTorre=false;
    this.torre;
    this.base;

    this.constructor = function (x,y,width,height) {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    };

});