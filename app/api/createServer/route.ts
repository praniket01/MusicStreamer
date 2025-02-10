import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import * as http from 'http';
import { randomUUID } from 'crypto';

let server: http.Server | null = null;
let wss: WebSocketServer | null = null;

export async function POST(req: NextRequest) {


    const roomID = randomUUID().slice(0, 8);
    const wsUrl = `ws://localhost:8080/${roomID}`;

    if (server) {
        return Response.json({ message: 'Server already running', url: { wsUrl } });
    }

    server = http.createServer();
    server.listen(8080, () => console.log(`WebSocket server running on ${wsUrl}`));
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

    return Response.json({ message: "Server created", url: { wsUrl } });
}

export async function DELETE() {
    if (wss) {
        wss.clients.forEach((client) => {
            client.close();
            wss = null;

        })
    }
    if (server) {
        server.close(() => {
            console.log("Websocket server stopped");
        })
    }
    return Response.json({ message: "Server stopped" });
}

