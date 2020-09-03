
function ready(){
    send_ready();
    started = false;
}
function create(){
    if(!connected){
        alert("could not connect to the server !");
        return;
    }
    roomCode = generateCode(8);
    creat_room();
    CopyEnterButton.removeAttribute("disabled");
    CodeText.removeAttribute("disabled");
    CodeText.value = roomCode;
    CopyEnterButton.value = "Copy";
    CreateButton.setAttribute("disabled","true");
    JoinButton.removeAttribute("disabled");
}
function join(){
    if(!connected){
        alert("could not connect to the server !");
        return;
    }
    CopyEnterButton.removeAttribute("disabled");
    CodeText.removeAttribute("disabled");
    CodeText.value = "";
    CopyEnterButton.value = "Enter";
    JoinButton.setAttribute("disabled","true");
    CreateButton.removeAttribute("disabled");
}
function copy_enter(){
    if(CopyEnterButton.value == "Enter"){
        CodeText.select();
        roomCode = CodeText.value;
        join_room();
    }else{
        CodeText.select();
        document.execCommand("copy");
    }
}



function generateCode(len)
{
    var listCode = "0123456789ABCDEF";
    r = "";
    for(var i = 0;i != len;i++)
    {
        r += listCode[Math.floor(Math.random()*listCode.length)];
    }
    return r;
}