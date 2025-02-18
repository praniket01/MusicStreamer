"use client"
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const router = useRouter();

    const createServer = async () => {
        try {

            debugger
            const response = await fetch('api/createServer', { method: 'POST' });
            const data = await response.json();
            if (response.status == 201) {
                setRoomId(data.serverCreatedroomID);
                alert(`Server created. Room ID: ${data.serverCreatedroomID}`);
                localStorage.setItem("roomId",data.serverCreatedroomID);
                router.push("../stream");
            }

        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">WebSocket Server</h1>
            <button onClick={createServer}>
            Create Room
                
            </button>
            <br></br>
            {/*  */}
            {roomId && <p>Room ID: {roomId}</p>}
            <br>
            </br>
            <button><Link href="../joinroom" className="no-underline text-blue-500"> Join Room  </Link></button>

        </div>
    )
}
