var start = function(p) {
    /**
     *
     *
     * ProcessingJS Initialization
     *
     *
     */

    /**
     *
     *
     * Common Functions
     *
     *
     */
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    var pointIsInRect = function(x, y, xRect, yRect, wRect, hRect) {
        return (x >= xRect && x <= (xRect + wRect)) &&
               (y >= yRect && y <= (yRect + hRect));
    };

    /**
     *
     *
     * Draw Helpers
     *
     *
     */
    var gradientX = function(x, y, w, h, c1, c2, percentage) {
        var xOffset = x + w;
        var yOffset = y + h;
        for (var i = x; i <= xOffset; i++) {
            var inter = p.map(i, x, xOffset, 0, 1);
            if (inter >= percentage) {
                break;
            }
            var c = p.lerpColor(c1, c2, inter);
            p.stroke(c);
            p.line(i, y, i, yOffset);
        }
    };
    var gradientY = function(x, y, w, h, c1, c2, percentage) {
        var xOffset = x + w;
        var yOffset = y + h;
        for (var i = y; i <= yOffset; i++) {
            var inter = p.map(i, y, yOffset, 0, 1);
            if (inter >= percentage) {
                break;
            }
            var c = p.lerpColor(c1, c2, inter);
            p.stroke(c);
            p.line(x, i, xOffset, i);
        }
    };

    var States = {
        Opening: 'opening',
        Opened: 'opened',
        Starting: 'starting',
        Started: 'started',
        Finishing: 'finishing',
        Finished: 'finished'
    };
    var Sizes = {
        Small: 'small',
        Medium: 'medium',
        Large: 'large'
    };
    var Colors = {
        Black: p.color(0, 0, 0),
        ForestGreen: p.color(120, 184, 81),
        Mantle: { // https://uigradients.com/#Mantle
            A: p.color(81, 74, 157),
            B: p.color(36, 198, 220)
        },
        Miaka: { // https://uigradients.com/#Miaka
            A: p.color(10, 191, 188),
            B: p.color(252, 53, 76)
        },
        Stellar: { // https://uigradients.com/#Stellar
            A: p.color(52, 138, 199),
            B: p.color(116, 116, 191)
        },
        Titanium: { // https://uigradients.com/#Titanium
            A: p.color(40, 48, 72),
            B: p.color(133, 147, 152)
        }
    };
    var Keys = {
        Up: function() {
            return p.keyCode === p.UP || p.key.code === 119;
        },
        Down: function() {
            return p.keyCode === p.DOWN || p.key.code === 115;
        },
        Left: function() {
            return p.keyCode === p.LEFT || p.key.code === 97;
        },
        Right: function() {
            return p.keyCode === p.RIGHT || p.key.code === 100;
        }
    };
    function Game() {
        var _this = this;
        this.size = {
            x: document.documentElement.clientWidth - 20,
            y: document.documentElement.clientHeight - 20
        };
        this.frameRate = 30;
        //this.state = States.Opening;
        this.state = States.Started;
    };
    var game = new Game();

    function Opening() {
        var _this = this;
        this.data = {
            percentageComplete: 0
        };
        this.view = {
            xMid: game.size.x / 2,
            yMid: game.size.y / 2,

            wBar: game.size.x * 0.8,
            hBar: game.size.y * 0.05
        };
        this.view.xBar = _this.view.xMid - (_this.view.wBar / 2);
        this.view.yBar = _this.view.yMid - (_this.view.hBar / 2);
        this.keyPressed = function() {
        };
        this.mousePressed = function() {
        };
        this.mouseReleased = function() {
        };
        this.tick = function() {
            _this.data.percentageComplete = _this.data.percentageComplete + 0.03;
            if (_this.data.percentageComplete >= 1) {
                game.state = States.Opened;
            }
        };
        this.paint = function() {
            gradientY(
                0,
                0,
                game.size.x,
                game.size.y,
                Colors.Titanium.A,
                Colors.Titanium.B);

            gradientX(
                _this.view.xBar,
                _this.view.yBar,
                _this.view.wBar,
                _this.view.hBar,
                Colors.Miaka.A,
                Colors.Miaka.B,
                _this.data.percentageComplete);
        };
    };
    var opening = new Opening();

    function Opened() {
        var _this = this;
        this.data = {
        };
        this.view = {
            xMid: game.size.x / 2,
            yMid: game.size.y / 2,

            wButton: game.size.x * 0.1,
            hButton: game.size.y * 0.1,

            pressedOverButton: false
        };
        this.view.xButton = _this.view.xMid - (_this.view.wButton / 2);
        this.view.yButton = _this.view.yMid - (_this.view.hButton / 2);
        this.keyPressed = function() {
        };
        this.mousePressed = function() {
            if (pointIsInRect(p.mouseX, p.mouseY, _this.view.xButton, _this.view.yButton, _this.view.wButton, _this.view.hButton)) {
                _this.view.pressedOverButton = true;
            }
            else {
                _this.view.pressedOverButton = false;
            }
        };
        this.mouseReleased = function() {
            if (pointIsInRect(p.mouseX, p.mouseY, _this.view.xButton, _this.view.yButton, _this.view.wButton, _this.view.hButton) && _this.view.pressedOverButton) {
                game.state = States.Starting;
            }
            else {
                _this.view.pressedOverButton = false;
            }
        };
        this.tick = function() {
        };
        this.paint = function() {
            gradientY(
                0,
                0,
                game.size.x,
                game.size.y,
                Colors.Titanium.A,
                Colors.Titanium.B);

            if (pointIsInRect(p.mouseX, p.mouseY, _this.view.xButton, _this.view.yButton, _this.view.wButton, _this.view.hButton)) {
                p.fill(Colors.Stellar.B);
            }
            else {
                p.fill(Colors.Stellar.A);
            }
            p.noStroke();
            p.rect(_this.view.xButton, _this.view.yButton, _this.view.wButton, _this.view.hButton);
            p.fill(Colors.White);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            p.text('Start!', _this.view.xButton, _this.view.yButton - 3, _this.view.wButton, _this.view.hButton);
        };
    };
    var opened = new Opened();

    function Starting() {
        var _this = this;
        this.data = {
        };
        this.view = {
        };
        this.keyPressed = function() {
        };
        this.mousePressed = function() {
        };
        this.mouseReleased = function() {
        };
        this.tick = function() {
            game.state = States.Started;
        };
        this.paint = function() {
            gradientY(
                0,
                0,
                game.size.x,
                game.size.y,
                Colors.Titanium.A,
                Colors.Titanium.B);
        };
    };
    var starting = new Starting();

    function Started() {
        var _this = this;
        var PLAYER_SIZE = 10;
        this.data = {
            player: {
                size: PLAYER_SIZE,
                speed: {
                    max: 6,
                    increment: 2
                },
                movement: {
                    x: 0,
                    y: 0
                },
                position: {
                    x: getRandomInt(PLAYER_SIZE, game.size.x - PLAYER_SIZE),
                    y: getRandomInt(PLAYER_SIZE, game.size.y - PLAYER_SIZE)
                }
            }
        };
        this.view = {
        };
        this.keyPressed = function() {
            if (Keys.Up()) {
                _this.data.player.movement.y -= _this.data.player.speed.increment;
            }
            if (Keys.Down()) {
                _this.data.player.movement.y += _this.data.player.speed.increment;
            }
            if (Keys.Left()) {
                _this.data.player.movement.x -= _this.data.player.speed.increment;
            }
            if (Keys.Right()) {
                _this.data.player.movement.x += _this.data.player.speed.increment;
            }
        };
        this.mousePressed = function() {
        };
        this.mouseReleased = function() {
        };
        this.tick = function() {
            _this.constrainPlayerSpeed(_this.data.player);

            if (_this.data.player.movement.x !== 0) {
                _this.data.player.position.x += _this.data.player.movement.x;
            }
            if (_this.data.player.movement.y !== 0) {
                _this.data.player.position.y += _this.data.player.movement.y;
            }

            _this.constrainPlayerBoundary(_this.data.player);
        };

        this.constrainPlayerSpeed = function(player) {
            if (player.movement.x > player.speed.max) {
                player.movement.x = player.speed.max;
            }
            if (player.movement.x < -player.speed.max) {
                player.movement.x = -player.speed.max;
            }
            if (player.movement.y > player.speed.max) {
                player.movement.y = player.speed.max;
            }
            if (player.movement.y < -player.speed.max) {
                player.movement.y = -player.speed.max;
            }
        };
        this.constrainPlayerBoundary = function(player) {
            if (player.position.x <= 0 + player.size) {
                player.position.x = player.size;
                player.movement.x = 0;
            }
            if (player.position.x >= game.size.x - player.size) {
                player.position.x = game.size.x - player.size;
                player.movement.x = 0;
            }
            if (player.position.y <= 0 + player.size) {
                player.position.y = player.size;
                player.movement.y = 0;
            }
            if (player.position.y >= game.size.y - player.size) {
                player.position.y = game.size.y - player.size;
                player.movement.y = 0;
            }
        }

        this.paint = function() {
            p.background(Colors.ForestGreen);
            p.fill(Colors.Black);
            p.ellipse(_this.data.player.position.x, _this.data.player.position.y, _this.data.player.size, _this.data.player.size);
        };
    };
    var started = new Started();

    var StateHandlers = {
        [States.Opening]: opening,
        [States.Opened]: opened,
        [States.Starting]: starting,
        [States.Started]: started
    };

    p.size(game.size.x, game.size.y); 
    p.frameRate(game.frameRate);

    // jack's stuff goes in here

    var blockDimensions = {
        width: 50,
        height: 50
    };

    var worldDimensions = { 
        width: 12,
        height: 12,
    };

    var world = [];
    var isPlayerNextToCPU = false;
    var playerDirection = null;

    for (var i = 0; i < worldDimensions.width; i += 1) {
        world[i] = [];
        for (var j = 0; j < worldDimensions.height; j += 1) {
            world[i][j] = {
                x: i * blockDimensions.width,
                y: j * blockDimensions.height,
                width: blockDimensions.width,
                height: blockDimensions.height,
                hasPlayer: false,
                hasTree: false,
                hasCPU: false,
                hasLake: false
            };
        }
    }

    var playerX = getRandomInt(0, worldDimensions.width - 1);
    var playerY = getRandomInt(0, worldDimensions.height - 1);
    world[playerX][playerY].hasPlayer = true;

    var numTrees = getRandomInt(6, 14);

    var numLakes = getRandomInt(1, 3);
    for (var i = 0; i < numLakes; i++) {
        var lakeX = getRandomInt(0, worldDimensions.width - 1);
        var lakeY = getRandomInt(0, worldDimensions.height - 1);
        
        world[lakeX][lakeY].hasLake = true;
        
        if (lakeY + 1 < worldDimensions.height) {
            world[lakeX][lakeY+1].hasLake = true;
        }
        if (lakeY - 1 >= 0) {
            world[lakeX][lakeY-1].hasLake = true;
        }
        if (lakeX + 1 < worldDimensions.width) {
            world[lakeX+1][lakeY].hasLake = true;
        }
        if (lakeX - 1 >= 0) {
            world[lakeX-1][lakeY].hasLake = true;
        }
        if (lakeX + 1 < worldDimensions.width && lakeY + 1 < worldDimensions.height) {
            world[lakeX+1][lakeY+1].hasLake = true;
        }
        if (lakeX + 1 < worldDimensions.width && lakeY - 1 >= 0) {
            world[lakeX+1][lakeY-1].hasLake = true;
        }
        if (lakeX - 1 >= 0 && lakeY - 1 >= 0) {
            world[lakeX-1][lakeY-1].hasLake = true;
        }
        if (lakeX - 1 >= 0 && lakeY + 1 < worldDimensions.height) {
            world[lakeX-1][lakeY+1].hasLake = true;
        }
    }
    for (var i = 0; i < numTrees; i++) {
        var treeX = getRandomInt(0, worldDimensions.width - 1);
        var treeY = getRandomInt(0, worldDimensions.height - 1);
        world[treeX][treeY].hasTree = true;
    }

    var numCPUs = getRandomInt(3, 7);
    for (var i = 0; i < numCPUs; i++) {
        var cpuX = getRandomInt(0, worldDimensions.width - 1);
        var cpuY = getRandomInt(0, worldDimensions.height - 1);
        world[cpuX][cpuY].hasCPU = true;
    }

    var plants = {
        tree: function(x, y) {

        }

    };

    // dad's stuff goes in here
    var dad = null;
    dad = {
        events: {},
        tick: function() {
            for (var key in this.events) {
                this.events[key]();
            }
            this.events = {};
        },
        addEvent: function(type, event) {
            this.events[type] = event;
        },
        isPointInBounds: function(x, y) {
            if (x < 0 || y < 0) {
                return false;
            }
            if (x >= worldDimensions.width || y >= worldDimensions.height) {
                return false;
            }
            return true;
        },
        isEmptyPoint: function(x, y) {
            if (! dad.isPointInBounds(x, y)) {
                return false;
            }
            var block = world[x][y];
            if (block.hasPlayer === true || block.hasLake === true || block.hasCPU === true) {
                return false;
            }
            return true;
        },
        pointHasCPU: function(x, y) {
            if (! dad.isPointInBounds(x, y)) {
                return false;
            }
            var block = world[x][y];
            if (block.hasCPU === true) {
                return true;
            }
            return false;
        },
        moveCPUs: function() {
            var oldPoints = {};
            var newPoints = {};
            for (var x = 0; x < world.length; x += 1) {
                for (var y = 0; y < world[x].length; y += 1) {
                    if (world[x][y].hasCPU === true)
                    {
                        // randomly decide to move
                        if (getRandomInt(0, 100) < 98) {
                            continue;
                        }
                        // try one of up, right, down, left 5 times
                        for (var i = 0; i < 5; i++) {
                            var randomInt = getRandomInt(0, 3);
                            var candidateX = x;
                            var candidateY = y;
                            // UP
                            if (randomInt === 0) {
                                candidateY--;
                            }
                            // RIGHT
                            else if (randomInt === 1) {
                                candidateX++;
                            }
                            // DOWN
                            else if (randomInt === 2) {
                                candidateY++;
                            }
                            // LEFT
                            else if (randomInt === 3) {
                                candidateX--;
                            }
                            if (dad.isEmptyPoint(candidateX, candidateY) &&
                                newPoints[candidateX + '.' + candidateY] !== true) {
                                oldPoints[x + '.' + y] = true;
                                newPoints[candidateX + '.' + candidateY] = true;
                                break;
                            }
                        }
                    }
                }
            }
            for (var x in oldPoints) {
                var point = x.split('.');
                world[point[0]][point[1]].hasCPU = false;
            }
            for (var x in newPoints) {
                var point = x.split('.');
                world[point[0]][point[1]].hasCPU = true;
            }
        },
        setIsPlayerNextToCPU: function() {
            if (playerDirection === p.UP) {
                if (dad.pointHasCPU(playerX, playerY - 1)) {
                    isPlayerNextToCPU = true;
                    return;
                }
            }
            else if (playerDirection === p.RIGHT) {
                if (dad.pointHasCPU(playerX + 1, playerY)) {
                    isPlayerNextToCPU = true;
                    return;
                }
            }
            else if (playerDirection === p.DOWN) {
                if (dad.pointHasCPU(playerX, playerY + 1)) {
                    isPlayerNextToCPU = true;
                    return;
                }
            }
            else if (playerDirection === p.LEFT) {
                if (dad.pointHasCPU(playerX - 1, playerY)) {
                    isPlayerNextToCPU = true;
                    return;
                }
            }
            isPlayerNextToCPU = false;
        },
        playerAttack: function() {
            if (playerDirection === p.UP) {
                world[playerX][playerY - 1].hasCPU = false;
            }
            else if (playerDirection === p.RIGHT) {
                world[playerX + 1][playerY].hasCPU = false;
            }
            else if (playerDirection === p.DOWN) {
                world[playerX][playerY + 1].hasCPU = false;
            }
            else if (playerDirection === p.LEFT) {
                world[playerX - 1][playerY].hasCPU = false;
            }
        }
    };

    var jordie = null;

    var jack = {

        drawTree: function(x, y) {
            p.fill(75, 168, 59);
            p.noStroke();
            p.ellipse(x + 10, y + 10, 45, 45);
            p.ellipse(x + 40, y + 10, 45, 45);
            p.ellipse(x + 40, y + 40, 45, 45);
            p.ellipse(x + 10, y + 40, 45, 45);
            p.stroke(0, 0, 0);
        },
        drawLake: function(block) {
            if (block.hasLake === true) {
                p.fill(13, 0, 255);
                p.noStroke();
                p.rect(block.x, block.y, blockDimensions.width, blockDimensions.height);
                p.stroke(0, 0, 0);
            }
        },
        draw: function() {
            for (var i = 0; i < world.length; i += 1) {
                for (var j = 0; j < world[i].length; j += 1) {
                    this.drawEnvironment(world[i][j]);
                }
            }
            for (var i = 0; i < world.length; i += 1) {
                for (var j = 0; j < world[i].length; j += 1) {
                    this.drawLake(world[i][j]);
                }
            }
            for (var i = 0; i < world.length; i += 1) {
                for (var j = 0; j < world[i].length; j += 1) {
                    this.drawPlayer(world[i][j]);
                    this.drawCPU(world[i][j]);
                }
            }
            for (var i = 0; i < world.length; i += 1) {
                for (var j = 0; j < world[i].length; j += 1) {
                    this.drawTrees(world[i][j]);
                }
            }
            if (isPlayerNextToCPU === true) {
                this.drawCPUInteractionOptions();
            }
        },

        drawCPUInteractionOptions: function() {
            p.fill(100, 100, 100, 90);
            p.rect(25, 25, 120, 40);
            p.fill(0, 0, 0, 90);
            p.textSize(16);
            p.text("a = Attack", 50, 50);
        },

        drawEnvironment: function(block) {
            p.fill(35, 105, 27);
            p.noStroke();
            p.rect(block.x, block.y, block.width, block.height);       
            p.stroke(0, 0, 0);
        },

        drawTrees: function(block) {
            if(block.hasTree === true && block.hasLake === false) {
                this.drawTree(block.x, block.y, block.width, block.height);  
            }
        },

        drawPlayer: function(block) {


            if (block.hasPlayer === true) {
                jordie.drawPlayer(block.x, block.y, block.width, block.height);
            }


        },
        drawCPU: function(block) {
            if (block.hasCPU === true) {
                p.fill(250, 150, 0);
                p.ellipse(block.x + blockDimensions.width / 2, block.y + blockDimensions.height / 2, blockDimensions.width - 25, blockDimensions.height - 25);
                p.fill(0, 0, 0);
                p.ellipse(block.x + blockDimensions.width / 2, block.y + blockDimensions.height / 2, blockDimensions.width - 40, blockDimensions.height - 40);
            }
        }

    };

    // jordie's stuff goes in here
    jordie = {
        drawPlayer: function(x, y, width, height) {

            var middleX = x + blockDimensions.width / 2;
            var middleY = y + blockDimensions.height / 2;

            p.fill(194, 110, 110);
            p.ellipse(middleX, middleY + 10, width-5, height-55);
            p.ellipse(middleX, middleY - 10, width-5, height-55);
            p.fill(224, 156, 156);
            p.ellipse(middleX, middleY - 5, width-5, height-55);
            p.ellipse(middleX, middleY + 5, width-5, height-55);
            p.fill(235, 202, 202);
            p.ellipse(middleX, middleY, width-5, height-55);
            p.fill(143, 40, 40);
            p.ellipse(middleX, middleY, width-22.5, height-22.5);
            p.fill(255, 0, 9);
            p.textSize(width-19);
            p.text("{  }",x + 6,y + 33);

            var lineLength = 15;
            if (playerDirection === p.UP) {
                p.line(middleX, middleY, middleX, middleY - lineLength);
            }
            else if (playerDirection === p.RIGHT) {
                p.line(middleX, middleY, middleX + lineLength, middleY);
            }
            else if (playerDirection === p.DOWN) {
                p.line(middleX, middleY, middleX, middleY + lineLength);
            }
            else if (playerDirection === p.LEFT) {
                p.line(middleX, middleY, middleX - lineLength, middleY);
            }
        }
    };

    p.keyReleased = function() {

        if (p.keyPressed && p.key.code === 97 && isPlayerNextToCPU) {
            dad.addEvent('playerAttack', dad.playerAttack);
        }
        if (p.keyPressed && (p.keyCode === p.UP || p.key.code === 107) && playerY > 0) {
            dad.addEvent('playerMove', function() {
                if (dad.pointHasCPU(playerX, playerY-1) === false) {
                    world[playerX][playerY].hasPlayer = false;
                    world[playerX][playerY-1].hasPlayer = true;
                    playerY--;
                }
                playerDirection = p.UP;
            });
        }
        if(p.keyPressed && (p.keyCode === p.DOWN || p.key.code === 106)  && playerY < worldDimensions.height - 1){
            dad.addEvent('playerMove', function() {
                if (dad.pointHasCPU(playerX, playerY+1) === false) {
                    world[playerX][playerY+1].hasPlayer = true;
                    world[playerX][playerY].hasPlayer = false;
                    playerY++;
                }
                playerDirection = p.DOWN;
            });
        }
        if(p.keyPressed && (p.keyCode === p.RIGHT || p.key.code === 108) && playerX < worldDimensions.width - 1) {
            dad.addEvent('playerMove', function() {
                if (dad.pointHasCPU(playerX+1, playerY) === false) {
                    world[playerX+1][playerY].hasPlayer = true;
                    world[playerX][playerY].hasPlayer = false;
                    playerX++;
                }
                playerDirection = p.RIGHT;
            });
        }  
        if (p.keyPressed && (p.keyCode === p.LEFT || p.key.code === 104) && playerX > 0) {
            dad.addEvent('playerMove', function() {
                if (dad.pointHasCPU(playerX-1, playerY) === false) {
                    world[playerX][playerY].hasPlayer = false;
                    world[playerX-1][playerY].hasPlayer = true;
                    playerX--;
                }
                playerDirection = p.LEFT;
            });
        }
    };

    p.keyPressed = function() {
        StateHandlers[game.state].keyPressed();
    };
    p.mousePressed = function() {
        StateHandlers[game.state].mousePressed();
    };
    p.mouseReleased = function() {
        StateHandlers[game.state].mouseReleased();
    };

    p.draw = function() {
        //p.background(120, 184, 81);
        //p.stroke(0, 0, 0);
        //jack.draw();

        //dad.addEvent('cpuMove', dad.moveCPUs);
        //dad.addEvent('setIsPlayerNextToCPU', dad.setIsPlayerNextToCPU);
        //dad.tick();
        StateHandlers[game.state].tick();
        StateHandlers[game.state].paint();
    };

};

