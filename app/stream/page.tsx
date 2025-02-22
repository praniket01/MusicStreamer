"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Stream() {
    const router = useRouter();
    const [roomId, setRoomId] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null); // WebSocket instance

    useEffect(() => {
        const storedRoomId: string | null = localStorage.getItem("roomId");
        setRoomId(storedRoomId);

        // Initialize WebSocket only if it's not already set
        if (!ws.current) {
            ws.current = new WebSocket("ws://localhost:8000");

            ws.current.onopen = () => {
                console.log("Connected to WebSocket Server");
            };

            ws.current.onmessage = (message) => {
                try {
                    const data = JSON.parse(message.data);
                    console.log("Received message:", data);
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            ws.current.onclose = () => {
                console.log("WebSocket connection closed");
                ws.current = null;
            };
        }

        // Cleanup WebSocket connection on unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []); // Run only once on component mount

    const stopServer = async () => {
        try {
            const response = await fetch('/api/createServer', { method: "DELETE" });
            const data = await response.json();
            console.log(data.message);
            router.push("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Welcome To Stream Music Online</h1>
            <p>Your Room ID is {roomId}</p>
            <button onClick={stopServer}>Stop Server</button>
        </div>
    );
}
