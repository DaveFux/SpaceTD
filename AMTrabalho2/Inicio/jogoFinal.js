/*
    todo ver o pathfinder que nao esta a bloquear a nova base
*/
(function () { //não apagar
        var Player = {
            dinheiro: 10,
            nivel: 1,
            pontos: 0,
            vida: 20
        }
        var Game = {
            wave: 1,
            nMinions: 10,
            boss: false,
            spawn: true
        }
        var point = {
            x: 0,
            y: 0
        };
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
        var asAuras = [];
        var path = [];
        var type = "base";
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
            var spBase = new SpriteSheet();
            spBase.load("samples//base.png", "samples//base.json", loaded);
            assets.push(spBase);
            var spBalas = new SpriteSheet();
            spBalas.load("samples//balas//tiros.png", "samples//balas//tiros.json", loaded);
            assets.push(spBalas);
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
            var spCreepsGreen2 = new SpriteSheet();
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

            }


            botaoInstrucoes.addEventListener("click", function () {

                var menuOverlay = document.createElement("div");
                menuOverlay.setAttribute("id", "menuOverlay");
                menu.appendChild(menuOverlay);
                var backButton = document.createElement("img");
                backButton.setAttribute("id", "backButton");
                backButton.setAttribute("src", "ImagemMenu/backButton.png");
                backButton.setAttribute("type", "button");
                menuOverlay.appendChild(backButton);
                var backgroundIns = document.createElement("img");
                backgroundIns.setAttribute("id", "backgroundIns");
                backgroundIns.setAttribute("src", "ImagemMenu/Instructions.png");
                menuOverlay.appendChild(backgroundIns);

                document.getElementById("backButton").onclick = function () {
                    menuOverlay.remove();
                }

            });

            //Botao Creditos
            document.getElementById("botaoCreditos").onclick = function () {

                var menuOverlay = document.createElement("div");
                menuOverlay.setAttribute("id", "menuOverlay");
                menu.appendChild(menuOverlay);
                var backButton = document.createElement("img");
                backButton.setAttribute("id", "backButton");
                backButton.setAttribute("src", "ImagemMenu/backButton.png");
                backButton.setAttribute("type", "button");
                menuOverlay.appendChild(backButton);
                document.getElementById("backButton").onclick = function () {
                    menuOverlay.remove();
                }
            }
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

            var header = document.createElement("div");
            header.setAttribute("id", "header");

            var infoDinheiro = document.createElement("p");
            infoDinheiro.setAttribute("id", "infoDinheiro");

            //var infoWave = document.createElement("p");
            //infoWave.setAttribute("id", "infoWave");

            var infoVida = document.createElement("p");
            infoVida.setAttribute("id", "infoVida");

            header.appendChild(infoDinheiro);
            header.appendChild(infoVida);
            div.appendChild(header);


            var sideMenu = document.createElement("div");
            sideMenu.setAttribute("id", "sideMenu");

            var btnTurret1 = document.createElement("a");
            btnTurret1.setAttribute("id", "btnTurret1");
            // btnTurret1.setAttribute("type", "button");
            btnTurret1.setAttribute("src", "samples/tower-defense-turrets/turret-1-1.png");
            sideMenu.appendChild(btnTurret1);

            btnTurret1.addEventListener("click", function () {
                towerType = "iceTower";
                type = "torre"
            }, false);

            var btnTurret2 = document.createElement("a");
            btnTurret2.setAttribute("id", "btnTurret2");
            // btnTurret2.setAttribute("type", "button");
            btnTurret2.setAttribute("src", "samples/tower-defense-turrets/turret-2-1.png");
            sideMenu.appendChild(btnTurret2);

            btnTurret2.addEventListener("click", function () {
                towerType = "sniperTower"
                type = "torre"
            }, false);

            var btnTurret6 = document.createElement("a");
            btnTurret6.setAttribute("id", "btnTurret6");
            // btnTurret6.setAttribute("type", "button");
            btnTurret6.setAttribute("src", "samples/tower-defense-turrets/turret-6-1.png");
            sideMenu.appendChild(btnTurret6);

            btnTurret6.addEventListener("click", function () {
                towerType = "cannonTower";
                type = "torre"
            }, false);

            var btnTurret7 = document.createElement("a");
            btnTurret7.setAttribute("id", "btnTurret7");
            // btnTurret7.setAttribute("type", "button");
            btnTurret7.setAttribute("src", "samples/tower-defense-turrets/turret-7-1.png");
            sideMenu.appendChild(btnTurret7);

            btnTurret7.addEventListener("click", function () {
                towerType = "flameTower";
                type = "torre";
            }, false);

            div.appendChild(sideMenu);


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
            var aux = [];
            for (var i = 0; i < 15; i++) {
                for (var j = 0; j < 15; j++) {
                    var tile = new Tile(x, y, 46, 46);
                    x += 46;
                    aux.push(tile);
                }
                tiles.push(aux);
                aux = [];
                x = 0;
                y += 46;
            }
            //canvases.background.ctx.translate(-(offscreenBackground.width>>1),-(offscreenBackground.height>>1));
            //canvases.background.canvas.fadeIn(1000);
            var spawns = tileBackground.getLayerByName("Spawn").objects;
            for (spawn of spawns) {
                var spawn = new refTile(gSpriteSheets['samples//casas.png'], spawn.x, spawn.y, spawn.width, spawn.height, "spawn");
                spawnPoints.push(spawn);
            }
            var ends = tileBackground.getLayerByName("Ending").objects;
            for (end of ends) {
                var end = new refTile(gSpriteSheets['samples//casas.png'], end.x, end.y, end.width, end.height, "ending");
                endPoints.push(end);
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
                    for (var j = 0; j < tiles[i].length; j++) {
                        if (tiles[i][j].hitTestPoint(point.x, point.y)) {
                            criarObjeto(tiles[i][j], type);
                        }
                    }
                }
            }, false);
            mudarNivel();
        }

        //Manipulaçao do caminho e do mapa
        function iniciarCaminho() {
            path = [];
            var aux = [];
            for (var i = 0; i < tiles.length; i++) {
                for (var j = 0; j < tiles[i].length; j++) {
                    var aux2 = 1;
                    if (tiles[i][j].temBase) {
                        aux2 = 0;
                    }
                    for (var end of endPoints) {
                        if (tiles[i][j].x == end.x && tiles[i][j].y == end.y && end.ativo) {
                            aux2 = 2;
                        }
                    }
                    aux.push(aux2);
                }
                path.push(aux);
                aux = [];
            }
        }

        function atualizarCaminho(tile, podeConstruir) {
            var i = tile.x / 46;
            var j = tile.y / 46;
            if (tiles[i][j].temBase && podeConstruir) {
                path[i][j] = 0
            } else if (!podeConstruir) {
                path[i][j] = 1
            }
            console.log(path);
        }

        function resetMapa() {
            osMobs = [];
            asBases = [];
            asTorres = [];
            entities = [];
            for (var i = 0; i < tiles.length; i++) {
                for (var j = 0; j < tiles[i].length; j++) {
                    tiles[i][j].temBase = false;
                    tiles[i][j].temTorre = false
                }
            }
        }

        function mudarNivel() {
            if (Player.nivel == 1) {
                tileBackground.getLayerByName("nivel1").visible = true;
                tileBackground.getLayerByName("infinito").visible = false;
                tileBackground.draw(offscreenBackground.getContext("2d"));
                spawnPoints[0].ativo = true;
                endPoints[0].ativo = true;
            } else {
                tileBackground.getLayerByName("nivel1").visible = false;
                tileBackground.getLayerByName("infinito").visible = true;
                tileBackground.draw(offscreenBackground.getContext("2d"));
                resetMapa();
                Player.dinheiro += 10;
                endPoints[0].ativo = false
                endPoints[1].ativo = true
            }
            iniciarCaminho();
        }

        //Criação de objectos
        function criarObjeto(tile, type) {
            switch (type) {
                case "torre":
                    colocarTorre(tile, false);
                    break;
                case "minion":
                    criarMinion(tile);
                    break;
                case "base":
                    var cont = 0;
                    var cont2 = 0;
                    var ms;
                    for (var spawn of spawnPoints) {
                        if (spawn.ativo) {
                            iniciarCaminho();
                            atualizarCaminho(tile, true);
                            ms = new Pathfinder(path, (tile.y / 46), (tile.x / 46));
                            path = ms.traverse(spawn.y / 46, spawn.x / 46);
                            if (ms.found) {
                                cont++;
                            }
                            cont2++;
                        }
                    }
                    if (cont == cont2) {
                        colocarTorre(tile, true);
                    } else {
                        atualizarCaminho(tile, false);
                    }
                    break;
            }
        }

        function criarMinion(spawn) {
            var mob = new Minion(gSpriteSheets['samples//creep//creep-1-blue//sprite.png'], spawn.x, spawn.y, "normal", 2, "");
            entities.push(mob);
            osMobs.push(mob);
        }

        function colocarTorre(tile, baseB) {
            if (baseB) {
                if (tile.temBase) {
                    return;
                }
                tile.temBase = true;
                var base = new Base(gSpriteSheets['samples//base.png'], tile.x + (tile.width / 4.5), tile.y + (tile.height / 4.5));
                entities.push(base);
                asBases.push(base);

            } else {
                if (tile.temTorre || !tile.temBase) {
                    return;
                }
                tile.temTorre = true;
                var torre = new Torre(gSpriteSheets['samples//tower-defense-turrets//tower-defense-turretsjson.png'], tile.x + (tile.width / 7), tile.y + (tile.height / 7), towerType, 2, "")
                if (towerType == "iceTower") {
                    var aura = new Bala(gSpriteSheets['samples//balas//tiros.png'], torre.x, torre.y, torre.type, torre.damage, torre.speed, torre.range, torre.special);
                    aura.alpha = 0.3;
                    aura.scale(torre.range);
                    aura.x = aura.x - aura.getHalfWidth() + 18;
                    aura.y = aura.y - aura.getHalfHeight() + 17;
                    aura.vx = 0;
                    aura.vy = 0;

                    console.log(aura.width);
                    console.log(aura.height);
                    entities.push(aura);
                    asAuras.push(aura);
                }
                entities.push(torre);
                asTorres.push(torre);

            }
        }

        function gerarMinons() {
            var cont = 0;
            // Game.nMinions = 10 * Game.wave;
            var interval = setInterval(function () {
                criarObjeto(spawnPoints[0], "minion")
                cont++;
                if (cont == Game.nMinions) {
                    window.clearInterval(interval);
                }
            }, 1000 / Player.nivel);
        }

        function checkColisions() {
            for (var bala of asBalas) {
                for (var mob of osMobs) {
                    if (bala.hitTestRectangle(mob)) {
                        mob.health -= bala.damage;
                        if (bala.special != undefined && !mob.debuff.includes("burn")) {
                            mob.debuff.push("burn");
                        }
                        bala.active = false;
                        console.log("Vida depois do damage:" + mob.health);
                        break;
                    } else {
                        if (mob.debuff.includes("burn")) {
                            mob.debuff.replace("burn", "");
                        }
                    }
                }
            }
            for (var aura of asAuras) {
                for (var mob of osMobs) {
                    if (aura.hitTestCircle(mob)){
                        mob.health -= aura.damage;
                        if (!mob.debuff.includes("slow")) {
                            mob.debuff.push("slow");
                        }
                    } else {
                                       
                        console.log("Antes: " + mob.debuff);
                        if (mob.slowApplied) {
                            for(var i=0; i<mob.debuff.length; i++){
                                if(mob.debuff[i].includes("slow")){
                                    mob.debuff.splice(i,1);
                                    mob.speed = mob.speed * 3;
                                    mob.slowApplied = false;
                                }
                            }
                        }
                        console.log("Depois: " + mob.debuff);
                    }
                }
            }
        }

        //Update
        function update() {
            //Mudança de nivel
            if (Game.wave == 11) {
                Player.nivel = 2;
                mudarNivel();
            }
            if (Game.wave % 10 == 0 && Game.wave <= 30) {
                spawnPoints[Game.wave / 10].ativo = true;
            }


            if (asTorres.length > 0 && osMobs.length > 0) {
                for (var torre of asTorres) {
                    for (var mob of osMobs) {
                        if (torre.type != "iceTower") {
                            if (torre.target != undefined) {
                                if (!(Math.abs(torre.x - torre.target.x) < (torre.range * 46) && Math.abs(torre.y - torre.target.y) < (torre.range * 46))) {
                                    torre.target = undefined;
                                    torre.rotation = 0;
                                } else {
                                    torre.rotate();
                                    if (torre.interval == 0) {
                                        var umaBala = new Bala(gSpriteSheets['samples//balas//tiros.png'], torre.x + torre.width / 2, torre.y, torre.type, torre.damage, torre.speed, torre.range, torre.special);
                                        umaBala.scaleFactor = 1;
                                        umaBala.rotation = 90 + torre.rotation;
                                        var dx = mob.x - torre.x;
                                        var dy = mob.y - torre.y;
                                        var mag = Math.sqrt(dx * dx + dy * dy);
                                        umaBala.vx = dx / mag * 10;
                                        umaBala.vy = dy / mag * 10;
                                        asBalas.push(umaBala);
                                        entities.push(umaBala);
                                        torre.interval = torre.speed;
                                        break;
                                    }
                                }
                            } else {
                                if (Math.abs(torre.x - mob.x) < (torre.range * 46) && Math.abs(torre.y - mob.y) < (torre.range * 46)) {
                                    torre.target = mob;
                                    torre.rotate();
                                    if (torre.interval == 0) {
                                        var umaBala = new Bala(gSpriteSheets['samples//balas//tiros.png'], torre.x + torre.width / 2, torre.y, torre.type, torre.damage, torre.speed, torre.range, torre.special);
                                        umaBala.scaleFactor = 1;
                                        var dx = mob.x - torre.x;
                                        var dy = mob.y - torre.y;
                                        var mag = Math.sqrt(dx * dx + dy * dy);
                                        umaBala.vx = dx / mag * 10;
                                        umaBala.vy = dy / mag * 10;
                                        asBalas.push(umaBala);
                                        entities.push(umaBala);
                                        torre.interval = torre.speed;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (osMobs.length == 0 && Game.spawn) {
                Game.spawn = false;
                gerarMinons();
            }
            // fazer o render dos tiles
            for (var i = 0; i < tiles.length; i++) {
                for (var j = 0; j < tiles[i].length; j++) {
                    tiles[i][j].drawColisionBoundaries(canvases.tiles.ctx, true, false, "black", "red");
                    if (tiles[i][j].hitTestPoint(point.x, point.y) && (tiles[i][j].temBase && type == "base" || tiles[i][j].temTorre && type == "torre" || !tiles[i][j].temBase && type == "torre")) {
                        canvases.tiles.ctx.clearRect(tiles[i][j].x, tiles[i][j].y, tiles[i][j].width, tiles[i][j].height);
                        tiles[i][j].drawColisionBoundaries(canvases.tiles.ctx, true, false, "red", "red");
                    } else if (tiles[i][j].hitTestPoint(point.x, point.y)) {
                        canvases.tiles.ctx.clearRect(tiles[i][j].x, tiles[i][j].y, tiles[i][j].width, tiles[i][j].height);
                        tiles[i][j].drawColisionBoundaries(canvases.tiles.ctx, true, false, "#00aa03", "red");
                    }
                }
            }
            for (var i = 0; i < spawnPoints.length; i++) {
                canvases.tiles.ctx.clearRect(spawnPoints[i].x, spawnPoints[i].y, spawnPoints[i].width, spawnPoints[i].height);
                if (spawnPoints[i].ativo) {
                    spawnPoints[i].render(canvases.tiles.ctx);
                    if (spawnPoints[i].hitTestPoint(point.x, point.y)) {
                        spawnPoints[i].drawColisionBoundaries(canvases.tiles.ctx, true, false, "red", "red");
                    }
                }
            }
            for (var end of endPoints) {
                canvases.tiles.ctx.clearRect(end.x, end.y, end.width, end.height);
                if (end.ativo) {
                    end.render(canvases.tiles.ctx);
                    if (end.hitTestPoint(point.x, point.y)) {
                        end.drawColisionBoundaries(canvases.tiles.ctx, true, false, "red", "red");
                    }

                }
            }
            console.log("N Balas:" + asBalas.length)
            checkColisions();
            for (var bala of asBalas) {
                if (bala.x < 0 || bala.y < 0 || bala.x > canvas.width || bala.y > canvas.height) {
                    bala.active = false;
                }
            }
            for (var mob of osMobs) {
                for (var end of endPoints) {
                    if (mob.x >= end.x && mob.y >= end.y && end.ativo) {
                        mob.active = false;
                        Player.vida -= mob.damage
                    }
                }
            }
            clearArrays(); // limpar os arrays

            render();

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


        //Render
        function render() {


            canvases.background.ctx.clearRect(0, 0, offscreenBackground.width, offscreenBackground.height,
                0, 0, offscreenBackground.width, offscreenBackground.height); //limpa o canvas

            // desenhar o tiled background em offscreen optimiza o rendering, pois só se desenha uma vez o tile completo
            canvases.background.ctx.drawImage(offscreenBackground,
                0, 0, offscreenBackground.width, offscreenBackground.height,
                0, 0, offscreenBackground.width, offscreenBackground.height
            );
            canvases.entities.ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < entities.length; i++) {
                entities[i].update();
                entities[i].render(canvases.entities.ctx)
                entities[i].drawColisionBoundaries(canvases.entities.ctx, true, false, "pink", "red");


            }
        }

        //KeyHandlers
        function keyDownHandler(e) {
            var codTecla = e.keyCode;
            teclas[codTecla] = true;
        }

        function keyUpHandler(e) {
            var codTecla = e.keyCode;
            teclas[codTecla] = false;

            switch (codTecla) {
                case 78: //N
                    if (Player.nivel == 1) {
                        Player.nivel = 2;
                        spawnPoints[1].ativo = true;
                    } else {
                        Player.nivel = 1;
                    }
                    mudarNivel();
                    break;
                case 77: //M
                    if (type == "base") {
                        type = "torre";
                    } else {
                        type = "base";
                    }
                    break;
                case 80:
                    for (var entitie of entities) {
                        if (entitie.vx != undefined) {
                            entitie.vx = 0;
                        }
                        if (entitie.vy != undefined) {
                            entitie.vy = 0;
                        }
                    }
                    break;
            }
        }

    }

)
(); // não apagar