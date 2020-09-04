var started = false;
var waySave = [];
// 2^0 = haut, 2^1 = droite, 2^2 = bas, 2^3 = gauche
// 1         , 2           , 4        , 8
// max value = 2^4-1 = 15
var walls  = [[]], enemyWalls = [];
var N = 7, myNumbers = [], enemyNumbers = [];
var mode = 0,canPlay = true,writemode = 0 , first = false;
/// default null
var Win = true;

function start_game(){
    started = true; 
}



function calculate_numbers(walls){
    var numbers = [], line = [];
    var n = 0;
    for(var i =0;i<N;i++){
        line = [];
        for(var j =0;j<N;j++){
            n = ((walls[i][j] >>> 3) & 1) + ((walls[i][j] >>> 2) & 1) + ((walls[i][j] >>> 1) & 1) + (walls[i][j] & 1);
            line.push(n);
        }
        numbers.push(line);
    }
    return numbers;
}

// n : 0 = haut, 1 = droite, 2 = bas, 3 = gauche
function set_wall(i,j,n){
    walls[i][j] = walls[i][j] | (1 << n);
}
// n : 0 = haut, 1 = droite, 2 = bas, 3 = gauche
function clear_wall(i,j,n){
    walls[i][j] = walls[i][j] & ~(1 << n);
}
// n : 0 = haut, 1 = droite, 2 = bas, 3 = gauche
function get_wall_value(i,j,n){
    if(writemode == 0)
        return (walls[i][j] & (1 << n)) >>> n;
    else if(writemode == 1){
        return (enemyWalls[i][j] & (1 << n)) >>> n;
    }
}

function zerosArray(N){
    var arr = [], larr = [];
    for(var i =0;i<N;i++){
        larr = [];
        for(var j =0;j<N;j++){
            larr.push(0);
        }
        arr.push(larr);
    }
    return arr;
}
function copyArray(arry){
    var arr = [],larr = [];
    for(var i =0;i<arry.length;i++){
        larr = [];
        for(var j =0;j<arry[i].length;j++){
            larr.push(arry[i][j]);
        }
        arr.push(larr);
    }
    return arr;
}
function can_go_ahead(i,j){
    waySave[i][j] = 1;
    if(i == (N-1) && j == (N-1)){
        return true;
    }
    
    var value = false;
    
    
    if(j != (N-1) && get_wall_value(i,j,1) == 0 && waySave[i][j+1] == 0){
        value = can_go_ahead(i,j+1);
        
    }
    if(value)
        return true;
    if(i != (N-1) && get_wall_value(i,j,2) == 0  && waySave[i+1][j] == 0){
        value = can_go_ahead(i+1,j);
    }
    if(value)
        return true;
    
    if(i != 0 && get_wall_value(i,j,0) == 0  && waySave[i-1][j] == 0){
        value = can_go_ahead(i-1,j);
    }
    if(value)
        return true;
    
    if(j != 0 && get_wall_value(i,j,3) == 0  && waySave[i][j-1] == 0){
        value = can_go_ahead(i,j-1);
    }
    
    return value;
}
function is_there_a_way(){
    waySave = zerosArray(N);
    return can_go_ahead(0,0);
}

function pass_roll(){
    canPlay = false;
    send_roll();
}

function played(i,j){
    send_played(i,j);
}

function my_roll(){
    canPlay = true;
}

function get_maze(walls,numbers){
    enemyWalls = walls;
    enemyNumbers = numbers;
}
function isRelatedWay(i,j){
    if(i == N-1 && j == N-1)
        return waySave[i][j-1] == 1 || waySave[i-1][j] == 1;
    if(i == 0){
        if(j == (N-1))
            return(waySave[i][j-1] == 1 || waySave[i+1][j] == 1);
        
        return(waySave[i][j-1] == 1 || waySave[i+1][j] == 1 || waySave[i][j+1] == 1);
    }
    if(j == 0){
        if(i == (N-1))
            return(waySave[i-1][j] == 1 || waySave[i][j+1] == 1);
        return(waySave[i-1][j] == 1 || waySave[i+1][j] == 1 || waySave[i][j+1] == 1);
    }
    
    if(j == (N-1)){
        return waySave[i-1][j] == 1 || waySave[i][j-1] == 1 || waySave[i+1][j] == 1;
        
    }
    if( i == (N-1))        
        return waySave[i-1][j] == 1 || waySave[i][j-1] == 1 || waySave[i][j+1] == 1;
    
    return waySave[i-1][j] == 1 || waySave[i][j-1] == 1 || waySave[i+1][j] == 1 || waySave[i][j+1] == 1;
}

function initDimension(scale,x,y){
    WIDTH = 500, HEIGH = 500;
    GRIDW = WIDTH*0.9*scale, GRIDH = HEIGH*0.7*scale;
    lineCursorMarge = 15*scale;
    if(x==undefined && y == undefined)
        mazeSquare = [WIDTH*0.05, HEIGH*0.05 , GRIDW, GRIDH];
    else
        mazeSquare = [x, y , GRIDW, GRIDH];
    pointsFontSize = 30*scale;
    
}

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }