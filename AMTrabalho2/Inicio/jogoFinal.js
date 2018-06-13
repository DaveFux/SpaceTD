/*
    todo fazer o background
*/
(function () { //não apagar

    var point = {x: 0, y: 0};
    var wave;
    var canvas;
    var drawingSurface;
    var entities = [];
    var teclas = new Array(255);
    var debugMode = true;
    var animationHandler;
    var asBarras;
    var asBalas=[];
    var spawnPoints = [];
    var endPoints = [];
    var asTorres = [];
    var osMobs = []
    var barraVida;
    var waveTimer;
    var towerType = "sniperTower";
    var GameStates = {
        RUNNING: 1,
        PAUSED: 2,
        STOPED: 3,
        LOADING: 4,
        LOADED: 4
    };
    var canvasses = {
        entities: {canvas: null, ds: null},
        components: {canvas: null, ds: null},
        background: {canvas: null, ds: null}
    }
    var GameSounds = {
        BALA: {},
        MOBS: {},
        GAME: {}
    };
    var tileBackground;

    var gameState;
    window.addEventListener("load", init, false);

    function init() {
        canvasses.background.canvas = document.querySelector("#canvasBack");
        canvasses.background.ds = canvasses.background.canvas.getContext("2d");

        canvasses.components.canvas = document.querySelector("#canvasComp");
        canvasses.components.ds = canvasses.components.canvas.getContext("2d");

        canvasses.entities.canvas = document.querySelector("#canvasEnt");
        canvasses.entities.ds = canvasses.entities.canvas.getContext("2d");


        gameState = GameStates.LOADING;

        var spBack = new SpriteSheet();
        spBack.load("samples//tower-defense//background.png", "samples//tower-defense//background.json", loaded);
        // var spBla
        var spCreepsBlue1 = new SpriteSheet();
        spCreepsBlue1.load("samples//creep//creep-1-blue//sprite.png", "samples//creep//creep-1-blue//sprite.json", loaded);
        var spCreepsRed1 = new SpriteSheet();
        spCreepsRed1.load("samples//creep//creep-1-red//sprite.png", "samples//creep//creep-1-red//sprite.json", loaded);
        var spCreepsGreen1 = new SpriteSheet();
        spCreepsGreen1.load("samples//creep//creep-1-green//sprite.png", "samples//creep//creep-1-green//sprite.json", loaded);
        var spCreepsYellow1 = new SpriteSheet();
        spCreepsYellow1.load("samples//creep//creep-1-yellow//sprite.png", "samples//creep//creep-1-yellow//sprite.json", loaded);
        var spTorre = new SpriteSheet();
        spTorre.load("samples//tower-defense-turrets//tower-defense-turretsjson.png", "samples//tower-defense-turrets//tower-defense-turretsjson.json", loaded);

        // var spTorre1 = new SpriteSheet();
        // spCreepsYellow1.load("samples//tower-defense-turrents//creep-1-yellow//sprite.png", "samples//creep//creep-1-yellow//sprite.json", loaded);
        // var spTorre2 = new SpriteSheet();
        // spCreepsYellow1.load("samples//creep//creep-1-yellow//sprite.png", "samples//creep//creep-1-yellow//sprite.json", loaded);
        // var spTorre3 = new SpriteSheet();
        // spCreepsYellow1.load("samples//creep//creep-1-yellow//sprite.png", "samples//creep//creep-1-yellow//sprite.json", loaded);
        // var spTorre4 = new SpriteSheet();
        // spCreepsYellow1.load("samples//creep//creep-1-yellow//sprite.png", "samples//creep//creep-1-yellow//sprite.json", loaded);

    }

    function loaded() {
        // S�O CARREGADAS 4 SpriteSheetS
        if (Object.keys(gSpriteSheets).length < 5) return;

        oBackground = new Background(gSpriteSheets['samples//tower-defense//background.png'], 0, 0);
        var container = document.querySelector("#idContainer");
        container.style.width = canvasses.entities.canvas.width + "px";
        container.style.height = canvasses.entities.canvas.height + "px";

        // =canvasses.entities.canvas.width = 800;
        // =canvasses.entities.canvas.height = 600;
        //
        //
        //
        // canvasses.background.canvas.width = 800;
        // canvasses.background.canvas.height = 600;
        //
        //
        // canvasses.components.canvas.width = 800;
        // canvasses.components.canvas.height = 600;

        canvas = canvasses.entities.canvas

        var mob = new Minion(gSpriteSheets['samples//creep//creep-1-blue//sprite.png'], 0, canvas.height / 2, "boss", 2, "")

        entities.push(mob);
        osMobs.push(mob);
        //entities.push(oBackground);   background
        oBackground.render(canvasses.background.ds);
        canvas.addEventListener("mousedown", criarObjeto, false);
        update();
        window.addEventListener("keydown", keyDownHandler, false);
        window.addEventListener("keyup", keyUpHandler, false);

    }

    function criarObjeto(e) {
        point.x = e.pageX - canvas.offsetLeft;
        point.y = e.pageY - canvas.offsetTop;
        colocarTorre();
    }

    function keyDownHandler(e) {
        var codTecla = e.keyCode;
        teclas[codTecla] = true;
    }

    function keyUpHandler(e) {
        var codTecla = e.keyCode;
        teclas[codTecla] = false;

        switch (codTecla) {

        }
    }

//	faz os testes de verifica��o de colis�es
    function colocarTorre() {
        var podeCriar = true;
        for (umaTorre of asTorres) {
            if (point.x == umaTorre.x && point.y == umaTorre.y) {
                console.log("colisao");
                return;
            }
            if (Math.abs(point.x - umaTorre.x) < 46) {
                if (point.x - umaTorre.x < 0) {
                    point.x -= Math.abs(point.x - umaTorre.x);
                } else if (point.x - umaTorre.x > 0) {
                    point.x += Math.abs(point.x - umaTorre.x);
                }
            }
            if (Math.abs(point.y - umaTorre.y) < 46) {
                if (point.y - umaTorre.y < 0) {
                    point.y -= Math.abs(point.y - umaTorre.y);
                } else if (point.y - umaTorre.y > 0) {
                    point.y += Math.abs(point.y - umaTorre.y);
                }
            }
        }
        if (podeCriar) {

            var torre = new Torre(gSpriteSheets['samples//tower-defense-turrets//tower-defense-turretsjson.png'], point.x, point.y, towerType, 2, "")

            entities.push(torre);
            asTorres.push(torre);
        }


    }

    function checkColisions() {

    }

    function update() {
        //Create the animation loop

        //COMPLETAR
        if (asTorres.length != 0 && osMobs != 0) {
        for (torre of asTorres) {
            for (mob of osMobs) {
                if (Math.abs(torre.x - mob.x) < (torre.range * 46) && Math.abs(torre.y - mob.y) < (torre.range * 46)) {
                    torre.attack(mob, function () {
                        var umaBala = new Bala(gSpriteSheets['assets//tank.png'], torre.x, torre.y + 5, 10, );
                        umaBala.scaleFactor = 0.3;
                        umaBala.vy = 4;
                        umaBala.id=Date.now();
                        asBalas.push(umaBala);
                        entities.push(umaBala);
                    });
                }else{
                    torre.rotation=0;
                }
            }
        }
    }

    render(); // fazer o render das entidades

    checkColisions();// Verificar se h� colis�es

    clearArrays(); // limpar os arrays

    animationHandler = window.requestAnimationFrame(update);

}

function filtrarAtivos(obj) {
    if (obj.active == true) return obj;
}

//	efetua a limpeza dos arrays
function clearArrays() {
    entities = entities.filter(filtrarAtivos);
    osMobs= osMobs.filter(filtrarAtivos);
    asTorres= asTorres.filter(filtrarAtivos);
    /*   osMisseis=osMisseis.filter(filtrarAtivos);
       asBalasSoldado=asBalasSoldado.filter(filtrarAtivos);
       asBalas=asBalas.filter(filtrarAtivos);*/

}



  
    function render() {
        //Clear the previous animation frame
        for (mob of osMobs){
            mob.update();
        }

      

    canvasses.entities.ds.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < entities.length; i++) {

        entities[i].render(canvasses.entities.ds)

    }
}

})
();// não apagar
