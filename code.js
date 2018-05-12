var start = function(p) {
    /**
     *
     *
     * ProcessingJS Initialization
     *
     *
     */
    p.size(600, 600); 
    p.frameRate(30);

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
                world[playerX][playerY].hasPlayer = false;
                world[playerX][playerY-1].hasPlayer = true;
                playerY--;
                playerDirection = p.UP;
            });
        }
        if(p.keyPressed && (p.keyCode === p.DOWN || p.key.code === 106)  && playerY < worldDimensions.height - 1){
            dad.addEvent('playerMove', function() {
                world[playerX][playerY+1].hasPlayer = true;
                world[playerX][playerY].hasPlayer = false;
                playerY++;
                playerDirection = p.DOWN;
            });
        }
        if(p.keyPressed && (p.keyCode === p.RIGHT || p.key.code === 108) && playerX < worldDimensions.width - 1) {
            dad.addEvent('playerMove', function() {
                world[playerX+1][playerY].hasPlayer = true;
                world[playerX][playerY].hasPlayer = false;
                playerX++;
                playerDirection = p.RIGHT;
            });
        }  
        if (p.keyPressed && (p.keyCode === p.LEFT || p.key.code === 104) && playerX > 0) {
            dad.addEvent('playerMove', function() {
                world[playerX][playerY].hasPlayer = false;
                world[playerX-1][playerY].hasPlayer = true;
                playerX--;
                playerDirection = p.LEFT;
            });
        }
    };
    var drawLoopCount = 0;
    p.draw = function() {
        p.background(120, 184, 81);
        p.stroke(0, 0, 0);
        jack.draw();
        drawLoopCount++;
        if (drawLoopCount % 1 === 0) {
            dad.addEvent('cpuMove', dad.moveCPUs);
            dad.addEvent('setIsPlayerNextToCPU', dad.setIsPlayerNextToCPU);
            dad.tick();
            drawLoopCount = 0;
        }
    };

};

