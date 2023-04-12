
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit('leave_room', { username, room, __createdtime__ });
    // Redirect to home page
    navigate('/', { replace: true });
  };

  return (
    <div className='w-28 md:w-56 lg:w-56 '>
      <div className='pt-10 flex flex-col items-center justify-center'>
      <h2 className=''>{room}</h2>
      <div>
        {roomUsers.length > 0 && <h5 className=''>Users:</h5>}
        <ul className=' '>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button className='' onClick={leaveRoom}>
        Leave
      </button>
      </div>
    </div>
  );
};

export default RoomAndUsers;