"use client"
import { useState } from "react";

export default function Home(){

    const [serverUrl,setServerUrl] = useState<string | null>(null);
    const [socket,setSocket] = useState<string | null>(null);
  
    const createServer = async() => {
        try {
            debugger
            const response = await fetch('api/createServer', {method : 'POST'});
            const data = await response.json();
         

        } catch (err) {
            console.error(err);
        }
    }
    const stopServer = async () => {
        try {
            debugger
            const response = await fetch('/api/createServer', {method : "DELETE"});
            const data = await response.json();
            console.log(data.message);
        } catch (err) {
            console.error(err);
        }
    }
    return(
        <div>
            <h1 className="text-2xl font-bold mb-4">WebSocket Server</h1>
            <button onClick={createServer}>
                Create Room
            </button>
            <br></br>
            <button onClick={stopServer}>Stop Server</button>
            {serverUrl && <p className="mt-4">WebSocket URL: {serverUrl}</p>}
        </div>
    )
}
