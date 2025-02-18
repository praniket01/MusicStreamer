"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function stream(){
    const router = useRouter();
    const [roomId , setRoomId] = useState<string|null>();
    useEffect(()=>{
        const roomId : string | null = localStorage.getItem("roomId");
        setRoomId(roomId);
    },[]);

    const stopServer = async () => {
        try {
            const response = await fetch('/api/createServer', { method: "DELETE" });
            const data = await response.json();
            console.log(data.message);
            router.push("/");
        } catch (err) {
            console.error(err);
        }
    }
    return(
    <div>
    <h1>Welcome To stream Music online and enjoy the experience of togetherness</h1>
    <p>Your Room ID is {roomId}</p>
    <button onClick={stopServer}>Stop Server</button>
    </div>)
}


/***
 * {
    "type": "join",
    "payload": {
        "roomId": "c40b2ffb"
    }
}
 * 
 */