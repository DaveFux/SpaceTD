var Pathfinder = function (maze, tileX, tileY, base) {
    this.found = false;
    this.path = [];
    this.maze = maze;
    
    this.traverse = function (y, x) {
        if(base){
        maze[tileX][tileY] = 0;
        }   
        var cc = {
                'x': y,
                'y': x
            };
        if (this.maze[y][x] == 2) {
              //console.log("We solved the maze at (" + x + ", " + y + ")");
            this.found = true;
            /*this.paths.push(this.path);
            this.path= new Array();*/
            this.path.push(cc);
        } else if (this.maze[y][x] == 1) {
            //console.log("At valid position (" + x + ", " + y + ")");

            if (!this.found) this.path.push(cc);

            this.maze[y][x] = 9;
            if (y < this.maze.length - 1) {
                this.traverse(y + 1, x);
            }
            if (x < this.maze[y].length - 1) {
                this.traverse(y, x + 1);
            }
            if (y > 0) {
                this.traverse(y - 1, x);
            }
            if (x > 0) {
                this.traverse(y, x - 1);
            }
        }
        return this.path;
    };
};