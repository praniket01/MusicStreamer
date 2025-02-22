"use client"

import { useEffect, useState } from "react";
import ClientRoom from "../ClientRoom/page";

const joinroom = () => {

    const [roomId, setRoomId] = useState<string>(() => localStorage.getItem("roomId") || "");
    const [name, setName] = useState<string>(() => localStorage.getItem("name") || "");
    const [error, setError] = useState<string>("");
    const [renderer, setRenderer] = useState<boolean>(!!localStorage.getItem("renderer"));

    useEffect(() => {
        localStorage.setItem("roomId", roomId);
        localStorage.setItem("name", name);
    }, [roomId, name])
    const onSubmit = async () => {
        debugger
        const ws = new WebSocket("ws://localhost:8000");

        ws.onopen = () => {
            if (roomId == null) {
                setError("please enter roomID: ");
            }

            else if (roomId && roomId.length < 8) {
                setError("Please Enter valid room ID : ")
            }

            else {
                const message = {
                    type: "join",
                    payload: {
                        roomId: `${roomId}`,
                        name: `${name}`
                    }

                }
                ws.send(JSON.stringify(message));

            }
        }
        ws.onmessage = (message) => {
            debugger
            try {
                const data = JSON.parse(message.data);
                if (data.type == "info") {
                    setRenderer(true)
                    localStorage.setItem("renderer", "true");
                }
                if (data.type == "error") {
                    setError(data.message);
                }
                
            } catch (error) {
                console.log(error);
            }
        }


    }
    if (renderer) {
        return <ClientRoom roomId={roomId} name={name} />;
    }
    return (
        <div>
            <input placeholder="Room ID" onChange={(e) => { setRoomId(e.target.value) }} value={roomId}></input>
            <br></br>
            <input placeholder="Join room as" onChange={(e) => { setName(e.target.value) }} value={name}></input>
            <br></br>

            {error}
            <button onClick={onSubmit}> Submit </button>
        </div>
    )
}

export default joinroom;