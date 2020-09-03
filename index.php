<!DOCTYPE html>


<html>
    <head>
        <title>Maze Battle</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="css/style.min.css" />
        <script src="socket.io/socket.io.js"></script>
        <script src="js/play.js"></script>
        <script src="js/display.js"></script>
        <script src="js/client.js"></script>
        <script src="js/drawfunctions.js"></script>
        <script src="js/buttonclicks.js"></script>
    </head>
    <canvas width="500px" height="500px" class="show" id="MyMaze"></canvas>
    <div class="show" id="Options">
        <input type="text" name="Code" disabled>
        <input type="button" name="copy_or_enter" onclick="copy_enter()" value="Copy" disabled>
        <input type="button" name="create" onclick="create()" value="Create">
        <input type="button" name="join" onclick="join()" value="Join">
    </div>
    <div class="" id="GameOptions">
        <input type="button" name="ready" onclick="ready()" value="Ready" >
    </div>
    <body>
    </body>
</html>