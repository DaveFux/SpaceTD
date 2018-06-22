var Pathfinder = function(maze) {
    this.found=false;
    this.path=[];

    this.maze = maze;

    this.traverse = function(x, y) {

        if(this.maze[x][y] == 2) {
            console.log("We solved the maze at (" + x + ", " + y + ")");
        }
            this.found=true;
            /*this.paths.push(this.path);
            this.path= new Array();*/
        } else if(this.maze[x][y] == 1) {
            console.log("At valid position (" + x + ", " + y + ")");

            var cc={'x':x,'y':y};
            if(!this.found) this.path.push(cc);

            this.maze[x][y] = 9;
            if(x < this.maze.length - 1) {
                this.traverse(x + 1, y);
            }
            if(y < this.maze[x].length - 1) {
                this.traverse(x, y + 1);
            }
            if(x > 0) {
                this.traverse(x - 1, y);
            }
            if(y > 0) {
                this.traverse(x, y - 1);
            }
        }

        return this.path;
    };