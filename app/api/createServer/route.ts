import { NextRequest } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer | null = null;

let allSockets: WebSocket[] = [];

export async function POST() {
    if (!wss) {
        wss = new WebSocketServer({ port: 8080 });
        wss.on('connection', (socket) => {
            allSockets.push(socket);

            socket.on("message", (message) => {
                wss?.clients.forEach((s) => {
                    if (s.readyState == s.OPEN) {
                        s.send(message.toString());
                    }

                })
            })
            socket.on("close", () => {
                allSockets = allSockets.filter(s => s !== socket);
            });

        });
    }

    return Response.json({ "message": "Server created" });

}

export async function DELETE() {
    debugger
    if (wss) {
        wss.clients.forEach((client) => {
            client.close();
            

        })
        wss.close();
        wss = null;
        allSockets = [];
    }

    return Response.json({ message: "Server stopped" });
}

