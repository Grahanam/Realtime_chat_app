
import Messages from "./Messages"
import SendMessage from "./Send_message"
import RoomAndUsers from "./RoomandUser"

const Chat=({socket,username,room})=>{
    return(
        <>
        <div className="flex flex-col h-screen">
            
            <div className="h-[88%] flex ">
                <div className="w-[30%]">
                    <RoomAndUsers socket={socket} username={username} room={room}/>
                </div>
                <div className="h-full flex-col w-[70%]">
                    <Messages socket={socket}/>  
                </div>
            </div>
            <div className="h-[12%]">
                <SendMessage socket={socket} username={username} room={room}></SendMessage>
            </div>
        </div>
        </>
    )
}

export default Chat