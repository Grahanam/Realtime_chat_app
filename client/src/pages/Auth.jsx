import React,{useState} from "react"
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Auth=()=>{
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [register,setRegister]=useState(false)
    let navigate=useNavigate()

    const Login=()=>{
        const options={
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({title:'React Hooks Post'})
        }
        const configuration = {
            method: "post",
            url: "http://localhost:7000/api/login",
            data: {
              username,
              password,
            },
          };
        axios(configuration)
        .then((result)=>{
            console.log(result)
            // set the cookie
            // alert(result.data.message)
            cookies.set("TOKEN", result.data.token, {
                path: "/",
            });
            cookies.set("USER", result.data.username, {
                path: "/",
            });
            // window.location.href = "/";
            setPassword('')
            setUsername('')
            navigate('/',{replace:true})
        })
        .catch((err)=>{
            console.log(err.response.data.message)
            alert(err.response.data.message)
        })
    }
    const Register=()=>{
        console.log(username,password)
        const configuration = {
            method: "post",
            url: "http://localhost:7000/api/register",
            data: {
              username,
              password,
            },
          };
        axios(configuration)
        .then((result)=>{
            console.log(result.data.message)
            alert(result.data.message)
            Login()
        })
        .catch((err)=>{
            console.log(err)
            alert(err.response.data.message)
        })
        setPassword('')
        setUsername('')
    }
    
    return(
        <>
        <div className="flex items-center justify-center h-screen overflow-hidden ">
            <div className="w-72 flex flex-col">
            <h1>User Auth</h1>
            <br />
            <input className="m-1 p-1" type="text" placeholder="Enter Username ..." value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <input className="m-1 p-1" type="password" placeholder="Enter Password ..." value={password} onChange={(e)=>setPassword(e.target.value)} />
            {register?(
                <>
                    <button className="m-1" onClick={Register}>Register</button>
                    <div>Already User? <span onClick={()=>{
                        setRegister(!register)
                        setPassword('')
                        setUsername('')
                        }} className="text-blue-500">Login</span></div>
                </>
            ):
            (<>
                <button className="m-1" onClick={Login}>Login</button>
                <div >New User? <span onClick={()=>{
                    setRegister(!register)
                    setPassword('')
                    setUsername('')
                    }} className="text-blue-500">Register</span></div>
             </>
            )
            }
            </div>
            

        </div>
        </>
    )
}

export default Auth