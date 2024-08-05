console.log("hola mundo");

const socket = io();

socket.emit("mensaje", "hola server!")

socket.on("saludo", (data) => {
    console.log(data);

})