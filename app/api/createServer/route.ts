import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from 'next/server';


let wss: WebSocketServer | null = null;

interface User {
    socket: WebSocket,
    room: string,
}

let allSockets: User[] = [];

export async function POST(req: NextRequest, res: NextResponse) {

    if (wss) {
        return NextResponse.json({ "message": "Server is already running" });
    }

    const serverCreatedroomID: string = randomUUID().slice(0, 8);

    wss = new WebSocketServer({ port: 8000 });
    console.log(`Websocket server created at ${serverCreatedroomID}`);

    wss.on('connection', (socket) => {
        debugger
        socket.on("message", (message) => {
            try {
                const parsedMessage = JSON.parse(message.toString());
                if (parsedMessage.type == "join") {
                    if (parsedMessage.payload.roomId === serverCreatedroomID) {
                        allSockets.push({ socket, room: serverCreatedroomID });
                        socket.send(JSON.stringify({ type: "info", message: `Joined room ${serverCreatedroomID}` }));
                        console.log(`Client joined room: ${serverCreatedroomID}`);
                    } else {
                        socket.send(JSON.stringify({ type: "error", message: "Invalid Room ID" }));
                        socket.close();
                    }

        
                }

            } catch (error) {
                console.log("Invalid message format",error);
                socket.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
            }

        })
        
        // socket.on("close", () => {
        //     allSockets = allSockets.filter(user => user.socket !== socket);
        //     console.log("Client disconnected");
        // });
    });

    return NextResponse.json({ message: "Server created", serverCreatedroomID }, { status: 201 });

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

