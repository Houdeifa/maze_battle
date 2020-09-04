var WIDTH = 500, HEIGH = 500;
var GRIDW  = 0, GRIDH = 0;
var EmptyWallsColor = "#DADADA", WallColor = "#632100",
    WallHoverColor = "#D3835C", TextColor = [
        "#21B600",
        "#00B666",
        "#FFA513",
        "#DD8300",
        "#E70303"
    ], endingPointColor = "#3F62FF", pointsFontSize = 30, ePointsFontSize = 20;
var mazeSquare = [WIDTH*0.05, HEIGH*0.05 , WIDTH*0.9, HEIGH*0.7];
var eMazeSquare = [WIDTH*0.15, HEIGH*0.4 , WIDTH*0.7, HEIGH*0.5];
var lineCursorMarge = 15;
var CaseWidth=0,CaseHeight=0;
var eCaseWidth=0,eCaseHeight=0;
var squarePoses = [[[]]],eSquarePoses = [[[]]],CursorWallPoses = [[[]]],oldMyNumbers = [];
var enemyWallsTodraw = [];
var ReadyButton = null, ctx = null, maze = null,
    CopyEnterButton = null, CodeText = null, CreateButton = null,
    JoinButton = null,options = [];
window.onload = function(){
    maze = document.getElementById("MyMaze");
    ctx = maze.getContext("2d");
    ReadyButton = document.querySelector("input[name=\"ready\"]");
    options = [];
    options.push(document.getElementById("Options"));
    options.push(document.getElementById("GameOptions"));
    walls = zerosArray(N);
    enemyWalls = zerosArray(N);
    myNumbers = zerosArray(N);
    oldMyNumbers = zerosArray(N);
    enemyNumbers = zerosArray(N);
    waySave = zerosArray(N);
    ;
    CopyEnterButton = document.querySelector("input[name=\"copy_or_enter\"]");
    CodeText = document.querySelector("input[name=\"Code\"]");
    CreateButton = document.querySelector("input[name=\"create\"]");
    JoinButton = document.querySelector("input[name=\"join\"]");
    
    CopyEnterButton.setAttribute("disabled","true");
    CodeText.setAttribute("disabled","true");
    
    display_win_list_mode(ctx,maze);
    
};

function display_win_list_mode(ctx,maze){
    mode = 3;
    ctx.clearRect(0,0,WIDTH,HEIGH);
    maze.onmousemove = null;
    maze.onclick = null;
    
    if(Win == null)
        return;
    
    if(Win == true){
        writeText(ctx,"You Won !", [WIDTH/2,HEIGH*3/10],30,"#000000",true);
    }else{
        writeText(ctx,"You Lost !", [WIDTH/2,HEIGH*3/10],30,"#000000",true);
    }
}
function display_2nd_mode(ctx,maze){
    var scale = 0.5;
    waySave = zerosArray(N);
    ctx.clearRect(0, 0, WIDTH, HEIGH);
    waySave[0][0] = 1;
    initDimension(scale);
    initDimension(scale,WIDTH/2 - GRIDW/2 , HEIGH*0.05*0.5);
    drawGrid(mazeSquare,ctx);
    display_numbers(ctx,false,true);
    drawGrid(mazeSquare,ctx);
    drawWalls(ctx);
    writemode = 1;
    drawGrid(eMazeSquare,ctx);
    start_game();
    write_number(ctx,0,0,0,true,undefined);
    colorCase(ctx,N-1,N-1,endingPointColor);
    drawGrid(eMazeSquare,ctx);
    
    maze.onmousemove = function(event){
        if(!started || mode != 1 || !canPlay)
            return;
        var pos = getMousePos(maze,event);
        var X = pos.x, Y =  pos.y;
        var somethingChanged = false;
        for(var i =0;i<N;i++){
            for(var j =0;j<N;j++){
                if(i == 0 && j == 0)
                    continue;
                if(i == N-1 && j == N-1)
                    continue;
                if(waySave[i][j] == 1)
                    continue;
                if(X > eSquarePoses[i][j][0] && X < eSquarePoses[i][j+1][0] && Y > eSquarePoses[i][j][1] && Y < eSquarePoses[i+1][j][1]){
                    colorCase(ctx,i,j,EmptyWallsColor);
                    somethingChanged = true;
                }
                else{
                    clearCase(ctx,i,j);
                    somethingChanged = true;
                }
            }
        }
        if(somethingChanged){
            drawGrid(eMazeSquare,ctx);
            drawSeenWalls(ctx);
        }
        
        
    }
    maze.onclick = function(event){
        if(!started || mode != 1 || !canPlay)
            return;
        
        var pos = getMousePos(maze,event);
        var X = pos.x, Y =  pos.y;
        var somethingChanged = false, play = false;
        for(var i =0;i<N;i++){
            for(var j =0;j<N;j++){
                if(i == 0 && j == 0)
                    continue;
                if(waySave[i][j] == 1)
                    continue;
                if(X > eSquarePoses[i][j][0] && X < eSquarePoses[i][j+1][0] && Y > eSquarePoses[i][j][1] && Y < eSquarePoses[i+1][j][1]){
                    if(isRelatedWay(i,j)){
                        somethingChanged = true;
                        play = false;
                        if(i != 0 && get_wall_value(i,j,0) == 0  && waySave[i-1][j] == 1){
                            play = true;
                        }
                        else if(i != (N-1) && get_wall_value(i,j,2) == 0  && waySave[i+1][j] == 1){
                            play = true;
                        }
                        else if(j != 0 && get_wall_value(i,j,3) == 0  && waySave[i][j-1] == 1){
                            play = true;
                        }
                        else if(j != (N-1) && get_wall_value(i,j,1) == 0  && waySave[i][j+1] == 1){
                            play = true;
                        }
                        else{
                            if(i != 0 && get_wall_value(i,j,0) == 1  && waySave[i-1][j] == 1){
                                enemyWallsTodraw.push([i,j,0]);
                            }
                            if(i != (N-1) && get_wall_value(i,j,2) == 1  && waySave[i+1][j] == 1){
                                enemyWallsTodraw.push([i,j,2]);
                            }
                            if(j != 0 && get_wall_value(i,j,3) == 1  && waySave[i][j-1] == 1){
                                enemyWallsTodraw.push([i,j,3]);
                            }
                            if(j != (N-1) && get_wall_value(i,j,1) == 1  && waySave[i][j+1] == 1){
                                enemyWallsTodraw.push([i,j,1]);
                            }
                            pass_roll();
                        }
                        if(play){
                            waySave[i][j] = 1;
                            if(i == N-1 && j == N-1){
                                write_number(ctx,i,j,enemyNumbers[i][j],false,"#FFFFFF");
                                console.log("Winn !!")
                            }
                            else
                            write_number(ctx,i,j,enemyNumbers[i][j],true);
                            played(i,j);
                        }
                    }
                }
            }
        }
        if(somethingChanged){
            drawGrid(eMazeSquare,ctx);
            drawSeenWalls(ctx);
        }
    }
}

function dispaly_1s_mode(ctx,maze){
    initDimension(1);
    drawGrid(mazeSquare,ctx);
    start_game();
    display_numbers(ctx,false,true);
    drawGrid(mazeSquare,ctx);
    maze.onmousemove = function(event){
        if(!started || mode != 0)
            return;
        var pos = getMousePos(maze,event);
        var X = pos.x, Y =  pos.y;
        var somethingChanged = false;
        for(var i =0;i<N;i++){
            for(var j =0;j<N;j++){
                if(X > CursorWallPoses[i][j][0][0][0] && X < CursorWallPoses[i][j][0][0][1] && Y > CursorWallPoses[i][j][0][1][0] && Y < CursorWallPoses[i][j][0][1][1]){
                   drawWall(i,j,0,ctx,WallHoverColor);
                    somethingChanged = true;
                }
                else if(get_wall_value(i,j,0) == 0){
                   drawWall(i,j,0,ctx,EmptyWallsColor);
                    somethingChanged = true;
                }else{
                   drawWall(i,j,0,ctx,WallColor);
                    somethingChanged = true;
                }

                if(X > CursorWallPoses[i][j][1][0][0] && X < CursorWallPoses[i][j][1][0][1] && Y > CursorWallPoses[i][j][1][1][0] && Y < CursorWallPoses[i][j][1][1][1]){
                   drawWall(i,j,3,ctx,WallHoverColor);
                    somethingChanged = true;
                }
                else if(get_wall_value(i,j,3) == 0){
                   drawWall(i,j,3,ctx,EmptyWallsColor);
                    somethingChanged = true;
                }else{
                   drawWall(i,j,3,ctx,WallColor);
                    somethingChanged = true;
                }
            }
        }
        if(somethingChanged){
            drawGrid(mazeSquare,ctx,false);
        }
    };
    maze.onclick = function(event){
        if(!started || mode != 0)
            return;
        var pos = getMousePos(maze,event);
        var X = pos.x, Y =  pos.y;
        var somethingChanged = false;
         for(var i =0;i<N;i++){
            for(var j =0;j<N;j++){
                if(X > CursorWallPoses[i][j][0][0][0] && X < CursorWallPoses[i][j][0][0][1] && Y > CursorWallPoses[i][j][0][1][0] && Y < CursorWallPoses[i][j][0][1][1]){
                    if(i==0)
                        continue;
                    if(get_wall_value(i,j,0) == 0){
                        drawWall(i,j,0,ctx,WallColor);
                        drawGrid(mazeSquare,ctx,false);
                        set_wall(i,j,0);  
                        set_wall(i-1,j,2);
                        somethingChanged = true;
                    }else{
                        clear_wall(i,j,0);
                        clear_wall(i-1,j,2);
                        drawWall(i,j,0,ctx,EmptyWallsColor);
                        somethingChanged = true;
                    }
                }

                if(X > CursorWallPoses[i][j][1][0][0] && X < CursorWallPoses[i][j][1][0][1] && Y > CursorWallPoses[i][j][1][1][0] && Y < CursorWallPoses[i][j][1][1][1]){
                    if(j==0)
                        continue;
                    if(get_wall_value(i,j,3) == 0){
                        drawWall(i,j,3,ctx,WallColor);
                        drawGrid(mazeSquare,ctx,false);
                        set_wall(i,j,3);
                        set_wall(i,j-1,1);
                        somethingChanged = true;
                    }else{
                        clear_wall(i,j,3);
                        clear_wall(i,j-1,1);
                        drawWall(i,j,3,ctx,EmptyWallsColor);
                        somethingChanged = true;
                    }
                }
            }
        }
        if(somethingChanged){
            display_numbers(ctx);
            drawGrid(mazeSquare,ctx,false);
            setTimeout(function(){
            drawGrid(mazeSquare,ctx);
            drawWalls(ctx);},100);
            var isWay = is_there_a_way();
            console.log("way : "+ isWay);
            if(!isWay)
               ReadyButton.setAttribute("disabled","true");
            else
               ReadyButton.removeAttribute("disabled")
        }
    }
}
