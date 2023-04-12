import React,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser} from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie'
import axios from 'axios'



const Form=({username,setUsername,room,setRoom,socket,password,setPassword})=>{
    let [toggle,settoggle]=useState(false)
    const [Roomdata,setRoomdata]=useState([])
    const navigate=useNavigate()
    const cookies=new Cookies()
    const logout=()=>{
        cookies.remove("TOKEN",{path:"/"});
        setUsername('')
        setRoom('')
        setPassword('')
        window.location.href="/" 
    }
    const joinroom=()=>{
        console.log(username,room)
        
        if(username!==''&&room!==''){
            console.log('hi')
            socket.emit('join_room',{username,room})
            navigate('/chat',{replace:true})
        }
    }
    const createroom=()=>{
        const configuration = {
            method: "post",
            url: "http://localhost:7000/api/saveroom",
            data: {
              username:username,
              name:room,
              password:password,
            },
        };
        axios(configuration)
        .then((result)=>{
            console.log(result)
            setRoom('')
            setPassword('')
            get_room()
            alert('Room created successfully!')

            
        })
        .catch((err)=>{
            console.log(err.response.data.error)
            alert(err.response.data.error)
        })

        
    }
    const join_room=()=>{
        const configuration = {
            method: "post",
            url: "http://localhost:7000/api/enterroom",
            data: {
              username:username,
              name:room,
              password:password,
            },
          };
        axios(configuration)
        .then((result)=>{
            console.log(result)
            socket.emit('join_room',{username,room})
            navigate('/chat',{replace:true})
            
        })
        .catch((err)=>{
            console.log(err.response.data)
            alert(err.response.data.message)
        })
    }

    const get_room=()=>{
            const configuration = {
                method: "get",
                url: `http://localhost:7000/api/room/${username}`,
              };
            axios(configuration)
            .then((result)=>{
                console.log(result.data)
                setRoomdata(result.data)
            })
            .catch((err)=>{
                console.log(err.response.data)
                alert(err.response.data.message)
            })

        // if(username!==''&&room!==''&&password!==''){
            
        //     socket.emit('join',username,room,password,(success) => {
        //         if (success) {
        //           console.log('Joined room successfully');
        //           navigate('/chat',{replace:true})
        //         } else {
        //           console.log('Failed to join room');
        //         }})
        // }
        
    }
    useEffect(()=>{
      get_room()
    },[])
    return(
        <>
        <div className='flex flex-row items-center justify-between p-2'>
            <div>
                <button className=" rounded-full py-2 px-3 flex items-center" >
                    <i ><FontAwesomeIcon icon={faUser} className=" text-white mr-2"/></i>    
                      <p className='text-white font-semibold mr-3 hover:underline'>{username}</p>
                </button>
            </div>        
                    
            <div><button onClick={logout} className='rounded-full'>Logout</button></div>
        </div>
        <br/>  
        <div className='flex flex-col items-center justify-center text-center'>
            <h4 className='p-3'>Your Chat Room</h4>
            <div className=' '>
                <select className='p-2 w-52 mr-3 rounded-9 m-1' onChange={(e)=>setRoom(e.target.value)}>
                    {Roomdata.map((room)=>(
                        <option key={room._id} value={`${room.name}`}>{room.name}</option>
                    ))}
                </select>
                <button className='m-1' onClick={joinroom}>Join Room</button>
            </div>
            <br/>
            {toggle?(<>
                <div>
                <h2 className='m-2'>Create New Room</h2>
                <input type='text' className='p-2 m-1' placeholder='Enter room name' value={room} onChange={(e)=>setRoom(e.target.value)}/>
                <input type='password' className='p-2 m-1' placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className='m-1' onClick={createroom}>Create Room</button>
                </div>
            </>)
            :
            (<>
               <div>
                <h2 className='m-2'>Join room</h2>
                <input type='text' className='p-2 m-1' placeholder='Enter room name' value={room} onChange={(e)=>setRoom(e.target.value)}/>
                <input type='password' className='p-2 m-1' placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className='m-1' onClick={join_room}>Join Room</button>
                </div>
            </>)}
            <br/>
            <button onClick={()=>{settoggle(!toggle) 
                                  setPassword('')
                                  setRoom('')
                                }
            }>
                {toggle?(<>Join others Room</>):(<>Create New Room</>)}
            </button>
            
            
        </div>
        </>
    )
}


export default Form