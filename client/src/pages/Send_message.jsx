import React,{useState} from 'react'

const SendMessage=({socket,username,room})=>{
    const [message,setMessage]=useState('')
    const sendMessage=()=>{
        if(message!==''){
            const __createdtime__=Date.now()
            socket.emit('send_message',{username,room,message,__createdtime__});
            setMessage('')
        }
    }
    return(
        <>
        <div className='w-full p-1 md:p-2 lg:p-4'>
            <input className='w-[75%] md:w-[85%] lg:w-[90%] p-2 rounded' placeholder='Message...' onChange={(e)=>setMessage(e.target.value)} value={message}/>
            <button className='w-[25%] md:w-[15%] lg:w-[10%]' onClick={sendMessage}>Send</button>
        </div>
        
        </>
    )
}

export default SendMessage