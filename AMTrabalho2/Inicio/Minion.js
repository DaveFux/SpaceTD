var Minion = Entity.extend(function () {
    this.currState; // estado atual;
    this.states = {
        WALK: 'WALK'
    };
    this.slowApplied = false;
    this.speed;
    this.health;
    this.damage = 1;
    this.drop = 5;
    this.vFrame = 0;
    this.debuff = [];
    this.currentPath = 0;
    this.path;

    this.constructor = function (spriteSheet, x, y, type, wave, mode, path) {
        this.super();
        this.x = x;
        this.y = y;
        this.path = path;
        this.currentFrame = 0;
        this.currState = this.states.WALK;
        this.isColliding = false;
        this.spriteSheet = spriteSheet;

        if (mode == "hard") {
            type = mode + type;
            this.drop = 15;
        }

        switch (type) {
            case "normal":
                this.speed = 2.5;
                this.health = 100;
                break;
            case "fast":
                this.speed = 3;
                this.health = 75;
                break;
            case "turtle":
                this.speed = 2;
                this.health = 125;
                break;
            case "boss":
                this.speed = 1;
                this.health = 150;
                this.damage = 5;
                this.drop = 15;
                break;
            case "hardnormal":
                this.speed = 3;
                this.health = 125;
                break;
            case "hardfast":
                this.speed = 5;
                this.health = 100;
                break;
            case "hardturtle":
                this.speed = 3;
                this.health = 150;
                break;
            case "hardboss":
                this.speed = 2;
                this.health = 1000;
                this.damage = 10;
                this.drop = 30;
                break;
        }
        this.health += Math.pow((wave / 2), Math.E);
        setup();
    };

    this.update = function () {
        this.vFrame = this.vFrame < this.frames.length - 1 ? this.vFrame + 0.1 : 0;
        this.currentFrame = Math.floor(this.vFrame);
        for (var i = 0; i < this.debuff.length; i++) {
            if (this.debuff[i].includes("burn")) {
                this.health -= 1;
            } else if (this.debuff[i].includes("slow") && !this.slowApplied) {
                this.speed = this.speed / 3;
                this.slowApplied = true;
            }
        }
        if (this.health <= 0) {
            this.killed = true;
            this.active = false;
        } else {
            console.log("Caminho do mob: ")
            console.log(this.path);
            for (var i = 0; i < this.path.length; i++) {
                if (this.currentPath === i) {
                    if (this.x < (this.path[i].x) * 46) {
                        if (this.x + this.speed > (this.path[i].x) * 46) {
                            this.x += (this.path[i].x * 46) - this.x;
                        } else {
                            this.x += this.speed;
                        }
                    } else if (this.x < (this.path[i + 1].x) * 46) {
                        this.currentPath = i + 1;
                        if (this.x + this.speed > (this.path[i + 1].x) * 46) {
                            this.x += (this.path[i + 1].x * 46) - this.x;
                        } else {
                            this.x += this.speed;
                        }
                    } else if (this.x > (this.path[i + 1].x) * 46) {
                        this.currentPath = i + 1;
                        if (this.x - this.speed < (this.path[i + 1].x) * 46) {
                            this.x -= this.x - (this.path[i + 1].x) * 46;
                        } else {
                            this.x -= this.speed;
                        }
                    } else if (this.y < (this.path[i].y) * 46) {
                        if (this.y + this.speed > (this.path[i].y) * 46) {
                            this.y += (this.path[i].y * 46) - this.y;
                        } else {
                            this.y += this.speed;
                        }
                    } else if (this.y > (this.path[i + 1].y) * 46) {
                        this.currentPath = i + 1;
                        if (this.y - this.speed < (this.path[i + 1].y) * 46) {
                            this.y -= this.y - (this.path[i + 1].y) * 46;
                        } else {
                            this.y -= this.speed;
                        }
                    } else if (this.y < (this.path[i + 1].y) * 46) {
                        this.currentPath = i + 1;
                        if (this.y + this.speed > (this.path[i + 1].y) * 46) {
                            this.y += (this.path[i + 1].y * 46) - this.y;
                        } else {
                            this.y += this.speed;
                        }
                        this.y += this.speed;
                    }
                    break;
                }
            }
            //this.x += this.speed; // o /4 para teste
        }
    };

    var setup = function () {
        this.eStates[this.states.WALK] = this.spriteSheet.getStats(this.states.WALK);
        this.frames = this.eStates[this.currState];
        this.width = this.frames[0].width;
        this.height = this.frames[0].height;
    }.bind(this);

    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };
});