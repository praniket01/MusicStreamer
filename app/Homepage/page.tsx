"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const router = useRouter();

    const createServer = async () => {
        try {
            const response = await fetch('api/createServer', { method: 'POST' });
            const data = await response.json();
            if (response.status == 201) {
                setRoomId(data.serverCreatedroomID);
                alert(`Server created. Room ID: ${data.serverCreatedroomID}`);
                localStorage.setItem("roomId", data.serverCreatedroomID);
                router.push("../Stream");
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                        MusicStream
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Experience music together, in real-time. Create your own room or join friends to listen to your favorite tracks simultaneously.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-zinc-900/80 backdrop-blur-lg rounded-lg p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-3 text-blue-400">Real-time Sync</h3>
                        <p className="text-gray-400">Everyone in the room hears the same music at the same time</p>
                    </div>
                    <div className="bg-zinc-900/80 backdrop-blur-lg rounded-lg p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-3 text-cyan-400">Easy to Use</h3>
                        <p className="text-gray-400">Simple room creation and joining process</p>
                    </div>
                    <div className="bg-zinc-900/80 backdrop-blur-lg rounded-lg p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-3 text-emerald-400">High Quality</h3>
                        <p className="text-gray-400">Crystal clear audio streaming experience</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-6">
                    <button
                        onClick={createServer}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full text-white font-semibold hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
                    >
                        Create Room
                    </button>
                    <Link 
                        href="../joinroom"
                        className="px-8 py-4 bg-zinc-900/80 backdrop-blur-lg rounded-full text-white font-semibold hover:bg-zinc-800/80 transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-500/20 hover:border-blue-500/40"
                    >
                        Join Room
                    </Link>
                </div>

                {/* Room ID Display */}
                {roomId && (
                    <div className="mt-8 text-center">
                        <p className="text-lg text-gray-400">Your Room ID:</p>
                        <p className="text-2xl font-mono bg-zinc-900/80 backdrop-blur-lg rounded-lg p-4 inline-block mt-2 border border-blue-500/20">
                            {roomId}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
