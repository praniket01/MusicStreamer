"use client"; // ✅ This ensures it runs on the client

import { useClientsStore } from "../context/useClientStore";

const JoinedClients = () => {
    const clients = useClientsStore((state) => state.clients); // 

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
