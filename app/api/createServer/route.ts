import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import * as http from 'http';

let server: http.Server | null = null;
let wss: WebSocketServer | null = null;

export async function POST(req: NextRequest) {
    debugger
    if (server) {
        return new Response(JSON.stringify({ message: 'Server already running', url: 'ws://localhost:8080' }), { status: 200 });
    }

    server = http.createServer();
    server.listen(8080, () => console.log("✅ WebSocket server running on ws://localhost:8080"));
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        ws.on('message', (data) => {
            console.log("Received:", data.toString());
            wss?.clients.forEach(client => {
                if (client.readyState === ws.OPEN) {
                    client.send(`Echo: ${data}`);
                }
            });
        });

        ws.send("Welcome to the WebSocket Server!");
    });

    return new Response(JSON.stringify({ message: "Server created", url: "ws://localhost:8080" }), { status: 201 });
}

export async function DELETE(){
    debugger
    if(wss){
        wss.clients.forEach((client) => {
            client.close();
            wss = null;

        })
    }
    if(server){
        server.close(()=>{
            console.log("Websocket server stopped");
        })
    }
    return Response.json({message : "Server stopped"});
}

