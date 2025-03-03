


interface clientRoomProps{
    roomId : string,
    name : string
}

export default function ClientRoom({roomId,name}:clientRoomProps){

    return(
    <div>
        <p>
            Welcome {name} to room {roomId}
        </p>
    </div>
    )

}