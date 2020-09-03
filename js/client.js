//var socket = io.connect('https://secure-badlands-57848.herokuapp.com');
var socket = io.connect('localhost:5000');
var roomCode = '';
var connected = false;
var cmd = {};
socket.on('message', function (message) {
    if (message = 'welcome') {
        connected = true;
    }
});

socket.on('newRoom', function (message) {
    if (message = 'welcome') {
       console.log("room created");
    }
});

socket.on('init', function (init) {
    if(init.cmd == "init"){
        mode = 0;
        start_game();
        first = init.first;
        dispaly_1s_mode(ctx,maze);
        options[0].classList.remove("show");
        options[1].classList.add("show");
    }
});

function join_room(){
    cmd = {cmd : "join",
           room : roomCode};
    socket.emit('cmd', cmd);
    socket.on(roomCode, function (cmd) {
        cmd_exec(cmd);
    });
}

function creat_room(){
    cmd = {cmd : "new",
           room : roomCode};
    socket.emit('cmd', cmd);
    socket.on(roomCode, function (cmd) {
        cmd_exec(cmd);
    });
}

function cmd_exec(cmd){
    console.log(cmd);
    switch(cmd.cmd){
        case "start":
            canPlay = first;
            mode = 1;
            get_maze(cmd.walls,cmd.numbers);
            display_2nd_mode(ctx,maze);
            break;
        case "play":
            writemode = 0;
            var i = cmd.pos[0], j = cmd.pos[1];
            write_number(ctx,i,j,myNumbers[i][j]);
            writemode = 1;
            break;
        case "roll":
            canPlay = ! canPlay;
            break;
            
    }
}


function send_roll(){
    cmd = {cmd : "roll",
          room: roomCode};
    socket.emit('cmd', cmd);
}

function send_played(i,j){
    cmd = {cmd : "played",
          pos : [i,j],
          room: roomCode};
    socket.emit('cmd', cmd);
    
}

function send_ready(){
    cmd = {cmd : "ready",
           room: roomCode,
           numbers : myNumbers,
           walls: walls};
    socket.emit('cmd', cmd);
}