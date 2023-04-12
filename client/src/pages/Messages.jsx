import react,{useState,useEffect,useRef}  from 'react'


const Messages=({socket})=>{
    const [Messagereceived,setMessagereceived]=useState([]);

    const messagesColumnRef = useRef(null); 


    useEffect(()=>{
        socket.on('receive_message',(data)=>{
            console.log(data)
            setMessagereceived((state)=>[
                ...state,
                {
                    message:data.message,
                    username:data.username,
                    __createdtime__:data.__createdtime__
                }
            ])
        })
        return()=>socket.off('receive_message');
    },[socket])

    useEffect(() => {
        // Last 100 messages sent in the chat room (fetched from the db in backend)
        socket.on('last_100_messages', (last100Messages) => {
          console.log('Last 100 messages:', JSON.parse(last100Messages));
          last100Messages = JSON.parse(last100Messages);
          // Sort these messages by __createdtime__
          last100Messages = sortMessagesByDate(last100Messages);
          setMessagereceived((state) => [...last100Messages, ...state]);
        });
    
        return () => socket.off('last_100_messages');
      }, [socket]);

      useEffect(() => {
        messagesColumnRef.current.scrollTop =
          messagesColumnRef.current.scrollHeight;
      }, [Messagereceived]);

      function sortMessagesByDate(messages) {
        return messages.sort(
          (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
      }
    function formatDateFromTimestamp(timestamp){
        const date=new Date(timestamp)
        return date.toLocaleString()
    }

    return(
        <>
        <div className='h-full overflow-y-scroll'>
        <div ref={messagesColumnRef}>
            {Messagereceived.map((msg,i)=>(
                <div key={i} className='p-1 md:p-3 lg:p-3 bg-black m-2 md:m-2 lg:m-2 rounded-lg '>
                    <div className='flex flex-row justify-between text-sm md:text-md lg:text-md'>
                        <div>{msg.username}</div>
                        <div>{formatDateFromTimestamp(msg.__createdtime__)}</div>
                    </div>
                    <div className='text-start p-1'>{msg.message}</div>
                </div>
                
            ))}
        </div>
        </div>
        </>
    )
}

export default Messages