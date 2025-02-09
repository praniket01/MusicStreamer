"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var http = require("http");
debugger
var server = http.createServer(function (request, response) {
    console.log(new Date() + " received request for " + request.url);
    response.end("Listening");
});
var wss = new ws_1.WebSocketServer({ server: server });
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws_1.WebSocket.OPEN)
                client.send(data, { binary: isBinary });
        });
    });
    ws.send("Hello Message from server!!");
    ws.send("Hello clients")
});
server.listen(8080, function () {
    console.log(new Date() + " Server is listening on 8080 ");
});
