import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import io from 'socket.io-client'
import './App.css'
import Form from './pages/Form'
import Chat from './pages/Chat'
import Auth from './pages/Auth'
import ProtectedRoutes from './ProtectedRoute'
import AuthRoute from './AuthRoute'
import Cookies from 'universal-cookie'

const socket= io.connect('http://localhost:7000')

function App() {
  const cookies=new Cookies()
  const [username,setUsername]=useState(()=>cookies.get('USER')?cookies.get('USER'):null)
  const [room,setRoom]=useState('')
  const [password,setPassword]=useState('')
  
  return (
    <BrowserRouter>
      <div className="App h-screen">
        <Routes>
          <Route 
            path='/auth' 
            element={
              <AuthRoute>
              <Auth 
                 username={username}
                 setUsername={setUsername}
              />
              </AuthRoute>
            }
          />
          <Route
            path='/' 
            element={
              <ProtectedRoutes>
            <Form
            username={username}
            setUsername={setUsername}
            room={room}
            setRoom={setRoom}
            socket={socket}
            password={password}
            setPassword={setPassword}
          />
          </ProtectedRoutes>
          }/>
          <Route path='/chat' element={<Chat username={username} room={room} socket={socket}/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
