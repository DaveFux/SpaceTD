/*
    todo fazer o background
*/
(function () { //não apagar
        var Player = {
            dinheiro: 10,
            nivel: 1,
            pontos: 0,
            vida: 20
        }
        var point = {
            x: 0,
            y: 0
        };
        var wave;
        var canvas;
        var drawingSurface;
        var entities = [];
        var teclas = new Array(255);
        var debugMode = true;
        var animationHandler;
        var asBases = [];
        var asBalas = [];
        var tiles = [];
        var spawnPoints = [];
        var endPoints = [];
        var asTorres = [];
        var osMobs = [];
        var barraVida;
        var waveTimer;
        var towerType = "sniperTower";
        var assetsLoadInfo;
        var assetsLoaded = 0;
        var assets = [];
        var offscreenBackground;
        var GameStates = {
            RUNNING: 1,
            PAUSED: 2,
            STOPED: 3,
            LOADING: 4,
            LOADED: 4
        };

        var canvases = {
            entities: {
                canvas: null,
                ctx: null
            },
            components: {
                canvas: null,
                ctx: null
            },
            tiles: {
                canvas: null,
                ctx: null
            },
            background: {
                canvas: null,
                ctx: null
            }
        };

        var GameSounds = {
            BALA: {},
            MOBS: {},
            GAME: {}
        };
        var tileBackground;
        var gameState;
        window.addEventListener("load", init, false);

        function init() {
            load();
        }

        function load() {

            loadInfo = document.querySelector("#loadInfo");
            assetsLoadInfo = document.querySelector("#assetLoaded");
            gameState = GameStates.LOADING;

            tileBackground = new TiledMap();
            tileBackground.load('./mapa', 'mapaAM.json', loaded);
            assets.push(tileBackground);

            //SpriteSheets
            var spCasas = new SpriteSheet();
            spCasas.load("samples//casas.png", "samples//casas.json", loaded);
            assets.push(spCasas);
            var spCreepsBlue1 = new SpriteSheet();
            spCreepsBlue1.load("samples//creep//creep-1-blue//sprite.png", "samples//creep//creep-1-blue//sprite.json", loaded);
            assets.push(spCreepsBlue1);
            var spCreepsRed1 = new SpriteSheet();
            spCreepsRed1.load("samples//creep//creep-1-red//sprite.png", "samples//creep//creep-1-red//sprite.json", loaded);
            assets.push(spCreepsRed1);
            var spCreepsGreen1 = new SpriteSheet();
            spCreepsGreen1.load("samples//creep//creep-1-green//sprite.png", "samples//creep//creep-1-green//sprite.json", loaded);
            assets.push(spCreepsGreen1);
            var spCreepsBlue2 = new SpriteSheet();
            spCreepsBlue2.load("samples//creep//creep-2-blue//sprite.png", "samples//creep//creep-2-blue//sprite.json", loaded);
            assets.push(spCreepsBlue2);
            var spCreepsRed2 = new SpriteSheet();
            spCreepsRed2.load("samples//creep//creep-2-red//sprite.png", "samples//creep//creep-2-red//sprite.json", loaded);
            assets.push(spCreepsRed2);
            var spCreepsGreen2= new SpriteSheet();
            spCreepsGreen2.load("samples//creep//creep-2-green//sprite.png", "samples//creep//creep-2-green//sprite.json", loaded);
            assets.push(spCreepsGreen2);

            var spTorre = new SpriteSheet();
            spTorre.load("samples//tower-defense-turrets//tower-defense-turretsjson.png", "samples//tower-defense-turrets//tower-defense-turretsjson.json", loaded);
            assets.push(spTorre);


        }

        function loaded(assetName) {
            assetsLoaded++;
            assetsLoadInfo.innerHTML = "Loading: " + assetName;
            if (assetsLoaded < assets.length) return;

            assets.splice(0); // apagar o array auxiliar usado para o load

            // Se já conseguimos chegar aqui, os assets estão carregados! Podemos começar a criar
            // e configurar os elementos do jogo
            gameState = GameStates.LOADED;
            assetsLoadInfo.innerHTML = "Game Loaded! Press any key to continue...";
            window.addEventListener("keypress", mainMenu, false); // espera por uma tecla pressionada para começar


        }

        function mainMenu() {

            /* Remoção da janela loading */
            loadInfo.remove();
            window.removeEventListener("keypress", mainMenu, false);
            /* ================  MAIN MENU ==================== */

            var menu = document.getElementById("mainMenu");
            var botaoStart = document.getElementById("botaoStart");
            var botaoInstrucoes = document.getElementById("botaoInstrucoes");
            var botaoCreditos = document.getElementById("botaoStart");
            menu.classList.toggle("hidden");


            //Botao Start
            document.getElementById("botaoStart").onclick = function () {
                menu.classList.add("class", "hidden");
                setupGame();

            };


            botaoInstrucoes.addEventListener("click", function () {

                var menuOverlay = document.createElement("div");
                menuOverlay.setAttribute("id", "menuOverlay");
                menu.appendChild(menuOverlay);
                var backButton = document.createElement("button");
                backButton.setAttribute("id", "backButton");
                backButton.setAttribute("type", "button");
                menuOverlay.appendChild(backButton);


                document.getElementById("backButton").onclick = function () {
                    menuOverlay.remove();
                };


            });

            //Botao Creditos
            document.getElementById("botaoCreditos").onclick = function () {

                var menuOverlay = document.createElement("div");
                menuOverlay.setAttribute("id", "menuOverlay");
                menu.appendChild(menuOverlay);
                var backButton = document.createElement("button");
                backButton.setAttribute("id", "backButton");
                backButton.setAttribute("type", "button");
                menuOverlay.appendChild(backButton);

                document.getElementById("backButton").onclick = function () {
                    menuOverlay.remove();
                };


            };


        }


        function setupGame() {

            window.removeEventListener("keypress", setupGame, false);

            var canvasEnt = document.createElement("canvas");
            canvasEnt.setAttribute("id", "canvasEnt");
            var canvasComp = document.createElement("canvas");
            canvasComp.setAttribute("id", "canvasComp");
            var canvasBack = document.createElement("canvas");
            canvasBack.setAttribute("id", "canvasBack");
            var canvasTiles = document.createElement("canvas");
            canvasTiles.setAttribute("id", "canvasTiles");

            canvases.background.canvas = canvasBack;
            canvases.background.ctx = canvases.background.canvas.getContext("2d");
            canvases.components.canvas = canvasComp;
            canvases.components.ctx = canvases.components.canvas.getContext("2d");
            canvases.tiles.canvas = canvasTiles;
            canvases.tiles.ctx = canvases.tiles.canvas.getContext("2d");
            canvases.entities.canvas = canvasEnt;
            canvases.entities.ctx = canvases.entities.canvas.getContext("2d");
            canvas = canvases.entities.canvas;

            offscreenBackground = document.createElement("canvas");
            offscreenBackground.width = tileBackground.getWidth();
            offscreenBackground.height = tileBackground.getHeight();

            var div = document.createElement("div");
            div.setAttribute("id", "principal");
            var container = document.createElement("div");
            container.setAttribute("id", "container");
            container.appendChild(canvases.background.canvas);
            container.appendChild(canvases.entities.canvas);
            container.appendChild(canvases.tiles.canvas);
            container.appendChild(canvases.components.canvas);
            div.appendChild(container);
            document.body.appendChild(div);


            if (Object.keys(gSpriteSheets).length < 6) return;

            canvases.entities.canvas.width = window.innerWidth;
            canvases.entities.canvas.height = window.innerHeight;
            canvases.background.canvas.width = window.innerWidth;
            canvases.background.canvas.height = window.innerHeight;
            canvases.components.canvas.width = window.innerWidth;
            canvases.components.canvas.height = window.innerHeight;
            canvases.tiles.canvas.width = 15 * 46;
            canvases.tiles.canvas.height = 15 * 46;
            canvas = canvases.entities.canvas;
            var y = 0;
            var x = 0;
            for (var i = 0; i < 15; i++) {
                for (var j = 0; j < 15; j++) {
                    var tile = new Tile(x, y, 46, 46);
                    x += 46;
                    tiles.push(tile)
                }
                x=0;
                y += 46;
            }
// console.log(tiles);

            var mob = new Minion(gSpriteSheets['samples//creep//creep-1-blue//sprite.png'], 0, canvas.height / 2, "normal", 2, "");
            entities.push(mob);
            osMobs.push(mob);

            //entities.push(oBackground);   background
            //canvases.background.ctx.translate(-(offscreenBackground.width>>1),-(offscreenBackground.height>>1));

            mudarNivel();
            // //canvases.background.canvas.fadeIn(1000);
            var spawns = tileBackground.getLayerByName("Spawn").objects;
            for (spawn of spawns) {
                var spawn = new refTile(gSpriteSheets['samples//casas.png'], spawn.x, spawn.y, spawn.width,spawn.height);
                console.log(spawn);
                spawnPoints.push(spawn);
            }

            gameState = GameStates.RUNNING;
            canvas.addEventListener("mousemove", function (e) {
                point.x = e.pageX - canvas.offsetLeft;
                point.y = e.pageY - canvas.offsetTop;
            }, false);
            update();
            window.addEventListener("keydown", keyDownHandler, false);
            window.addEventListener("keyup", keyUpHandler, false);
            canvas.addEventListener("click", function () {
                for (var i = 0; i < tiles.length; i++) {
                    if (tiles[i].hitTestPoint(point.x, point.y)) {
                        criarObjeto(i);
                    }
                }
            }, false);
        }

        function mudarNivel() {
            if (Player.nivel == 1) {

                tileBackground.getLayerByName("nivel1").visible = true;
                tileBackground.getLayerByName("infinito").visible = false;
                tileBackground.draw(offscreenBackground.getContext("2d"));
            } else {
                tileBackground.getLayerByName("nivel1").visible = false;
                tileBackground.getLayerByName("infinito").visible = true;
                tileBackground.draw(offscreenBackground.getContext("2d"));
            }
        }


        function criarObjeto(i) {
            console.log(tiles[i]);
            colocarTorre(tiles[i]);
        }

        function keyDownHandler(e) {
            var codTecla = e.keyCode;
            teclas[codTecla] = true;
        }

        function keyUpHandler(e) {
            var codTecla = e.keyCode;
            teclas[codTecla] = false;

            switch (codTecla) {
                case 78:
                    if (Player.nivel == 1) {
                        Player.nivel = 2;
                    } else {
                        Player.nivel = 1;
                    }
                    mudarNivel();
                    break;
            }
        }

        //	faz os testes de verifica��o de colis�es
        function colocarTorre(tile) {
            var podeCriar = true;

            if (podeCriar) {
                var torre = new Torre(gSpriteSheets['samples//tower-defense-turrets//tower-defense-turretsjson.png'], tile.x + (tile.width / 7), tile.y + (tile.height / 7), towerType, 2, "")
                entities.push(torre);
                asTorres.push(torre);
            }


        }

        function checkColisions() {

        }

        function update() {
            //Create the animation loop

            // if (asBases.length > 0 && osMobs > 0) {
            if (asTorres.length > 0) {
                for (torre of asTorres) {
                    for (mob of osMobs) {
                        if (Math.abs(torre.x - mob.x) < (torre.range * 46) && Math.abs(torre.y - mob.y) < (torre.range * 46)) {
                            torre.attack(mob, function (mob) {
                                var umaBala = new Bala(gSpriteSheets['assets//tank.png'], torre.x, torre.y + 5, torre.type, torre.damage, torre.speed, torre.range, torre.special);
                                umaBala.scaleFactor = 0.3;
                                umaBala.vy = umaBala.y - mob.y;
                                umaBala.vx = umaBala.x - mob.x;
                                umaBala.id = Date.now();
                                asBalas.push(umaBala);
                                entities.push(umaBala);
                            });
                        } else {
                            torre.rotation = 0;
                        }
                    }
                }
                for (torre of asTorres) {
                    for (mob of osMobs) {
                        if (Math.abs(torre.x - mob.x) < (torre.range * 46) && Math.abs(torre.y - mob.y) < (torre.range * 46)) {
                            torre.attack(mob);
                        } else {
                            torre.rotation = 0;
                        }
                    }
                }
            }
            //  }

            render(); // fazer o render das entidades

            for (var i = 0; i < tiles.length; i++) {
                tiles[i].drawColisionBoundaries(canvases.tiles.ctx, true, false, "black", "red");
                if (tiles[i].hitTestPoint(point.x, point.y)) {
                    canvases.tiles.ctx.clearRect(tiles[i].x, tiles[i].y, tiles[i].width, tiles[i].height);
                    tiles[i].drawColisionBoundaries(canvases.tiles.ctx, true, false, "#31FF00", "red");
                }
            }
            for (var i = 0; i < spawnPoints.length; i++) {
                    spawnPoints[i].render(canvases.tiles.ctx);
                if (spawnPoints[i].hitTestPoint(point.x, point.y)) {
                    canvases.tiles.ctx.clearRect(spawnPoints[i].x, spawnPoints[i].y, spawnPoints[i].width, spawnPoints[i].height);
                    spawnPoints[i].drawColisionBoundaries(canvases.tiles.ctx, true, false, "red", "red");
                }
            }
            checkColisions(); // Verificar se h� colis�es

            clearArrays(); // limpar os arrays

            animationHandler = window.requestAnimationFrame(update);

        }

        function filtrarAtivos(obj) {
            if (obj.active == true) return obj;
        }

        //	efetua a limpeza dos arrays
        function clearArrays() {
            entities = entities.filter(filtrarAtivos);
            osMobs = osMobs.filter(filtrarAtivos);
            asTorres = asTorres.filter(filtrarAtivos);
            asBalas = asBalas.filter(filtrarAtivos);
            asBases = asBases.filter(filtrarAtivos)
        }


        function render() {
            for (mob of osMobs) {
                mob.update();
            }

            canvases.background.ctx.clearRect(0, 0, offscreenBackground.width, offscreenBackground.height,
                0, 0, offscreenBackground.width, offscreenBackground.height); //limpa o canvas

            // desenhar o tiled background em offscreen optimiza o rendering, pois só se desenha uma vez o tile completo
            canvases.background.ctx.drawImage(offscreenBackground,
                0, 0, offscreenBackground.width, offscreenBackground.height,
                0, 0, offscreenBackground.width, offscreenBackground.height
            );
            canvases.entities.ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < entities.length; i++) {

                entities[i].render(canvases.entities.ctx)

            }
        }
    }
)(); // não apagar