import axios from "axios";
import { useState } from "react";

export default function Home(){

    const [serverUrl,setServerUrl] = useState<string | null>(null);
    const [socket,setSocket] = useState<string | null>(null);
  
    const createServer = async() => {
        try {
            const response = await fetch('api/createServer', {method : 'POST'});
            const data = await response.json();
            
            if(response.status == 201){
                const url: string = data.url;
                setServerUrl(data.url);
                const ws: any = new WebSocket(url);
                setSocket(ws);
            }

        } catch (err) {
            console.error(err);
        }
    }
    const stopServer = async () => {
        debugger
        try {
            const response = await fetch('/api/createServer', {method : "DELETE"});
            const data = await response.json();
            console.log(data.message);
            setServerUrl(null);
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
