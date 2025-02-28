

import JoinedClients from "../components/JoinedClients";

export default function ClientLayout({children}: {children: React.ReactNode}){
    return(
    <div className="flex">
        {children}
        <div className="flex-1 p-4">
 
                <JoinedClients />
            
            
                
        </div>
    </div>
    )
}