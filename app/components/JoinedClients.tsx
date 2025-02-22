"use client"; 
import { useState, useEffect, useRef } from "react";

const JoinedClients = () => {
    const [clients, setClients] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null); // Store WebSocket instance

    useEffect(() => {
        // Check if WebSocket is already open
        debugger
        if (!ws.current) {
            ws.current = new WebSocket("ws://localhost:8000");

            ws.current.onopen = () => {
                console.log("✅ WebSocket connection opened");
            };

            ws.current.onmessage = (msg) => {
                try {
                    const data = JSON.parse(msg.data);
                    if (data.type === "updateclients") {
                        setClients(data.clients);
                    }
                } catch (error) {
                    console.error("❌ Error parsing message:", error);
                }
            };

            ws.current.onerror = (error) => {
                console.error("❌ WebSocket error:", error);
            };

            ws.current.onclose = () => {
                console.log("❌ WebSocket connection closed");
                ws.current = null; // Reset WebSocket on close
            };
        }

        // Cleanup WebSocket when component unmounts
        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, []); // Run only on mount

    return (
        <div className="w-64 bg-gray-800 text-white p-4 fixed right-0 top-0 h-full shadow-lg">
            <h2 className="text-lg font-bold mb-2">Connected Clients</h2>
            <ul>
                {clients.length > 0 ? (
                    clients.map((client, index) => (
                        <li key={index} className="p-2 bg-gray-700 rounded my-1">
                            {client}
                        </li>
                    ))
                ) : (
                    <li>No clients connected</li>
                )}
            </ul>
        </div>
    );
};

export default JoinedClients;
