"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, HtmlHTMLAttributes } from "react";

export default function Stream() {
    const router = useRouter();
    const [roomId, setRoomId] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null); // WebSocket instance
    const [song, setSong] = useState<string>("");
    const [data, setData] = useState([]);
    const [audiourl, setAudiourl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [selectedSong, setSelectedSong] = useState<string>("");

    useEffect(() => {

        const storedRoomId: string | null = localStorage.getItem("roomId");
        setRoomId(storedRoomId);
        // Initialize WebSocket only if it's not already set
        if (!ws.current) {
            ws.current = new WebSocket("wss://localhost:8000");

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

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

   
    async function playMusic(videoId: string) {
        const res = await fetch('/Stream/api/play', {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ videoId: videoId })
        })
        const data = await res.json();
        if (data.audioUrl) {
            setAudiourl(data.audioUrl);

        }
        else {
            console.log("Error playing audio");
        }

    }
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
    async function onSongSearch() {
        const result = await fetch("/Stream/api/search",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: song })
            },
        );
        const res = await result.json();
        //@ts-ignore
        setData(res.items || []);

    }

    function handlePlay(videoID: string) {
        debugger
        const msg = {
            type: "play",
            videoId: videoID,
            roomId: roomId
        }
        ws.current?.send(JSON.stringify(msg));

    }
    return (
        <div>
            <h1>Welcome To Stream Music Online</h1>
            <p>Your Room ID is {roomId}</p>
            <button onClick={stopServer}>Stop Server</button>

            <input placeholder="Whats on your mind" onChange={(e) => { setSong(e.target.value) }} value={song}></input>
            <button onClick={onSongSearch}>Search</button>
            <ul>
                {
                    data.map((item: any, index) => (
                        <li key={index}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedSong(item.id.videoId); playMusic(item.id.videoId) }}>
                                {item.snippet.title}
                            </a>

                        </li>
                    ))
                }

            </ul>
            {audiourl &&
                (<audio ref={audioRef} controls onPlay={()=>{ handlePlay(selectedSong) }}>
                    <source src={audiourl} type="audio/mp3" />
                </audio>


                )}

        </div>
    );
}