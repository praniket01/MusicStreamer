import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { error } from 'console';
import ytdl from 'ytdl-core';


let wss: WebSocketServer | null = null;

interface User {
    socket: WebSocket,
    room: string,
    name: string,
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
        socket.on("message", (message) => {
            try {
                const parsedMessage = JSON.parse(message.toString());
                if (parsedMessage.type == "join") {
                    if (parsedMessage.payload.roomId === serverCreatedroomID) {
                        allSockets.push({ socket, room: serverCreatedroomID, name: parsedMessage.payload.name });
                        socket.send(JSON.stringify({ type: "info", message: `Joined room ${serverCreatedroomID}`, flag: true, allSockets }));

                        broadcastClients(serverCreatedroomID);
                        console.log(`Client joined room: ${serverCreatedroomID}`);
                        // broadcastClients(serverCreatedroomID);
                        return NextResponse.json({ message: "Client Joined", serverCreatedroomID }, { status: 201 });
                    } else {
                        socket.send(JSON.stringify({ type: "error", message: "Invalid Room ID" }));
                        socket.close();
                    }


                }
                if (parsedMessage.type == "play") {
                    const { videoId, roomId } = parsedMessage;
                    streamAudio(videoId, roomId);
                }

            } catch (error) {
                console.log("Invalid message format", error);
                socket.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
            }

        })
        socket.on("close", () => {
            allSockets = allSockets.filter((user) => user.socket !== socket);
            broadcastClients(serverCreatedroomID);
        });
    });

    return NextResponse.json({ message: "Server created", serverCreatedroomID }, { status: 201 });

}

async function streamAudio(videoId: string, roomId: string) {
    debugger
    try {
        const res = axios.post('https://localhost:3000/app/Stream/api/play', { videoId });
        //@ts-ignore
        const audiourl = await res.data.audioUrl;
        if (!audiourl) {
            return NextResponse.json({ error: "Error fetching Audio URL" });

        }
        const audioStream = ytdl(audiourl, { filter: "audioonly", quality: "highestaudio" });

        audioStream.on("data", (chunks) => {
            const clientsInRoom = allSockets.filter(x => x.room === roomId);
            clientsInRoom.forEach(({ socket }) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(chunks);
                }
            });
            audioStream.on("end", () => {
                console.log("Streaming finished");
            });


        })


    } catch (error) {
        NextResponse.json({ error: "catch error" });
    }
}

function broadcastClients(serverCreatedroomID: string) {
    const clientsInRoom = allSockets.filter(x => x.room === serverCreatedroomID);
    const clientNames = clientsInRoom.map(x => x.name);

    clientsInRoom.forEach(({ socket }) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "updateclients",
                clients: clientNames,
            }));
        }
    });
};

export async function DELETE() {
    if (wss) {
        wss.clients.forEach((client) => {
            client.close();


        })
        wss.close();
        wss = null;
        allSockets = [];

        Storage: localStorage.clear();
    }

    return Response.json({ message: "Server stopped" });
}

