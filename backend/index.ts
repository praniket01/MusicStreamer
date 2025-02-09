import{ WebSocket, WebSocketServer} from 'ws';
import * as  http  from 'http';

const server = http.createServer((request:any,response:any)=>{
    console.log(new Date()+" received request for "+ request.url)
    response.end("Listening");
})

const wss = new WebSocketServer({server});

wss.on('connection', function connection(ws){
    ws.on('error',console.error);

    ws.on('message',function message(data,isBinary){
        wss.clients.forEach(function each(client){
            if(client.readyState === WebSocket.OPEN)
                client.send(data,{binary:isBinary});
        });

    });
    ws.send("Hello Message from server!!");

});

server.listen(8080, function(){
    console.log(new Date() + " Server is listening on 8080 ");
})