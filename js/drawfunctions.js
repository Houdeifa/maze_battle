
function colorCase(ctx,i,j,color){
    ctx.fillStyle = color;
    var pos = [],cW = 0, cH = 0;
    if(writemode == 0){
        pos = squarePoses[i][j];
        cW = CaseWidth, cH = CaseHeight;
    }
    else if(writemode == 1){
        pos = eSquarePoses[i][j];
        cW = eCaseWidth, cH = eCaseHeight;
    }
    ctx.fillRect(pos[0], pos[1], cW, cH);
}

function write_number(ctx,i,j,n,reverse,color){
    if(reverse == undefined)
        reverse = false;
    if(color == undefined)
        ctx.fillStyle=TextColor[n];
    else
        ctx.fillStyle=color;
    
    var pos = [],cW = 0, cH = 0;
    if(reverse) {colorCase(ctx,i,j,TextColor[n]);ctx.fillStyle="#FFFFFF";}
    if(writemode ==0){
        ctx.font = pointsFontSize+'px sans serif';
        pos = squarePoses[i][j];
        cW = CaseWidth, cH = CaseHeight;
    }
    else if(writemode == 1){
        ctx.font = ePointsFontSize+'px sans serif';
        pos = eSquarePoses[i][j];
        cW = eCaseWidth, cH = eCaseHeight;
    }
        
    ctx.fillText(n,pos[0]+(cW*4/10) ,pos[1]+ (cH*3/4));
}
function display_numbers(ctx,recalculate,all){
    if(recalculate == undefined || recalculate)
        myNumbers = calculate_numbers(walls);
    if(all == undefined)
        all = false;
    for(var i =0;i<N;i++){
        for(var j =0;j<N;j++){
            if(all || oldMyNumbers[i][j] != myNumbers[i][j]){
                clearCase(ctx,i,j);
                if(i==0 && j == 0)
                    write_number(ctx,i,j,myNumbers[i][j],true);
                else if( i ==(N-1) && j == (N-1) ){
                    colorCase(ctx,i,j,endingPointColor);
                    write_number(ctx,i,j,myNumbers[i][j],false,"#FFFFFF");
                }
                else
                    write_number(ctx,i,j,myNumbers[i][j]);
            }
        }
    }
    oldMyNumbers = copyArray(myNumbers);
}

function drawSeenWalls(ctx){
    var arr = enemyWallsTodraw;
    for(var i = 0;i <arr.length;i++){
        drawWall(arr[i][0],arr[i][1],arr[i][2],ctx,WallColor);
    }
    drawGrid(eMazeSquare,ctx,false);
}

function clearCase(ctx,i,j){
    var pos = [],cW = 0, cH = 0;
    if(writemode == 0){
        pos = squarePoses[i][j];
        cW = CaseWidth, cH = CaseHeight;
    }
    else if(writemode == 1){
        pos = eSquarePoses[i][j];
        cW = eCaseWidth, cH = eCaseHeight;
    }
    ctx.clearRect(pos[0], pos[1], cW, cH);
}

function writeText(ctx,Text,pos,size,color,centred){
    var offsets = [0, 0];
    if(centred == true)
        offsets = [((Text.length)*(size*0.7 - 2.2))/2, size/2];
    ctx.font = size+'px sans serif';
    ctx.fillStyle=color;
    ctx.fillText(Text,pos[0] - offsets[0],pos[1] - offsets[1]);
}
function clearCases(ctx){
    for(var i =0;i<N;i++){
        for(var j =0;j<N;j++){
            clearCase(ctx,i,j);
        }
    }
}
function drawWall(i,j,n,ctx,color){
    ctx.beginPath();
    ctx.strokeStyle = color;
    var poses = null;
    
    if(writemode == 0){
        poses = squarePoses;
    }
    else if(writemode == 1){
        poses = eSquarePoses;
    }
    if(n == 3){
        ctx.moveTo(poses[i][j][0], poses[i][j][1]);
        ctx.lineTo(poses[i+1][j][0], poses[i+1][j][1]);
    }else if(n==0){
        ctx.moveTo(poses[i][j][0], poses[i][j][1]);
        ctx.lineTo(poses[i][j+1][0], poses[i][j+1][1]);
    }
    ctx.stroke();
}
function drawWalls(ctx){
    ctx.beginPath();
    ctx.strokeStyle = WallColor;
    var wallH = 0, wallV = 0;
    
    var poses = null;
    
    if(writemode == 0){
        poses = squarePoses;
    }else if(writemode == 1){
        poses = eSquarePoses;
    }
     for(var i =0;i<N;i++){
        for(var j =0;j<N;j++){
            wallH = get_wall_value(i,j,0), 
            wallV = get_wall_value(i,j,3);
            if(wallH == 1){
                ctx.moveTo(poses[i][j][0], poses[i][j][1]);
                ctx.lineTo(poses[i][j+1][0], poses[i][j+1][1]);
            }
            if(wallV == 1){
                ctx.moveTo(poses[i][j][0], poses[i][j][1]);
                ctx.lineTo(poses[i+1][j][0], poses[i+1][j][1]);
            }
        }
    }
    ctx.stroke();
}

function drawGrid(square,ctx,Grid){
    if(Grid == undefined)
        Grid = true;
    var x = square[0], y = square[1], w = square[2],h = square[3];
    var M = lineCursorMarge;
    var mW = w/N, mH = h/N , arr = [],poses = [],vX = 0, vY = 0;
    if(writemode == 0){
        CaseWidth = mW;
        CaseHeight = mH;
    }else if(writemode == 1){
        eCaseWidth = mW;
        eCaseHeight = mH;
    }
    ctx.lineWidth = 5;
    if(Grid){
        ctx.beginPath();
        ctx.strokeStyle = EmptyWallsColor;
        if(writemode == 0){
            squarePoses = [];
            eSquarePoses = copyArray(eSquarePoses);
        }
        CursorWallPoses = [];
        if(writemode == 1){
            eSquarePoses = [];
            squarePoses = copyArray(squarePoses);
        }
        for(var j =0;j<N+1;j++){
            arr = [];
            poses = [];
            for(var i =0;i<N+1;i++){
                vX = i*mW+x, vY = j*mH+y;
                arr.push([vX, vY]);
                poses.push([ [[vX, (i+1)*mW+x], [vY-M, vY+M]],[[vX-M, vX+M], [vY, (j+1)*mH+y]]]);
                if(i== N || j == N)
                    continue;
                if(i!=0){
                    ctx.moveTo(vX, vY);
                    ctx.lineTo(vX, (j+1)*mH+y);
                }
                if(j!=0){
                    ctx.moveTo(vX, vY);
                    ctx.lineTo((i+1)*mW+x, vY);
                }
            }
            CursorWallPoses.push(poses);
            if(writemode == 0)
                squarePoses.push(arr);
            else if (writemode ==1)
                eSquarePoses.push(arr);
        }
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(x,y,w,h);
    ctx.stroke();
}