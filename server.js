
var http = require('http');
var fs = require('fs');

var roomList = {};
var PORT = process.env.PORT || 5000;
// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    console.log('Serveur crée !' + PORT);
    
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket,pseudo) {
    console.log('Un client est connecté !');
    socket.emit('message', 'welcome');

    

 socket.on('cmd', function(cmd) {
     var command = cmd.cmd;
     var Room = cmd.room;
     
     switch(command){
         case "new":
            if(!isRoom(Room)){
                console.log('Room N°' + Room + ' initialized !');
                socket.emit('newRoom', 'welcome');
                socket.join(Room);
                roomList[Room] = {joined : 1,
                                 ready : [],
                                'maze' : { 'walls' : null,
                                    'numbers' : null}};
             }
             break;
         case "join":
             var rooms = Object.keys(socket.rooms);
            if(roomList[Room] != undefined)
            if(isRoom(Room) && rooms[1] != Room && roomList[Room].joined == 1){
                socket.join(Room);
                console.log('client joined room : ' + Room );
                roomList[Room].joined = 2;
                
                var init = {'cmd' : "init",
                           'first' : get_ramdom()};
                socket.to(Room).emit("init", init);
                init.first = !init.first;
                socket.emit("init", init);
            }
             break;
         case "ready":
             if(!roomList[Room].ready.includes(socket.id))
                 roomList[Room].ready.push(socket.id);
             if(roomList[Room].ready.length == 2){
                cmd.cmd = "start";
                socket.to(Room).emit(Room, cmd);
                 cmd.numbers = roomList[Room].maze.numbers;
                 cmd.walls = roomList[Room].maze.walls;
                socket.emit(Room,cmd);
             }else{
                roomList[Room].maze.walls = cmd.walls;
                roomList[Room].maze.numbers = cmd.numbers;
             }
             break;
         case "played":
             cmd.cmd = "play";
             socket.to(Room).emit(Room, cmd);
             break;
         case "roll":
             cmd.cmd = "roll";
             socket.to(Room).emit(Room, cmd);
             break;
     }
     
     
    });
    
});

function get_ramdom(){
    if(Math.random() < 0.5){
        return true;
    }else{
        return false;
    }
}
function isRoom(code){
    if (io.sockets.adapter.rooms) {
        for (var room in io.sockets.adapter.rooms) {
            if(room == code){
                return true;
            }
        }
    }
    return false;
}

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
