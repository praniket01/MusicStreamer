"use client"

import { useState } from "react";

const joinroom = () => {

    const [roomId, setRoomId] = useState<string>("");
    const [error, setError] = useState<string>("");


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
                        roomId: `${roomId}`
                    }

                }
                ws.send(JSON.stringify(message));

            }
        }
    }

    return (
        <div>
            <input placeholder="Room ID" onChange={(e) => { setRoomId(e.target.value) }} value={roomId}></input>
            <br></br>
            <input placeholder="Join room as"></input>
            <br></br>
            {error}
            <button onClick={onSubmit}> Submit </button>
        </div>
    )
}

export default joinroom;