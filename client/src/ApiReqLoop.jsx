
import { useState } from 'react'
import { useEffect } from 'react'
import { socket } from './socket'

export default function ApiReqLoop() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleMessage = (message) => {
    const payload = { sender: user?.email, message }
    socket.emit('message', payload)
    setMessages(prev => [...prev, payload])
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    handleMessage(message);
    setMessage('');
  };



  useEffect(() => {
    fetch('http://localhost:5000/user').then(res => res.json()).then(data => setUser(data))



// moving the code that waits for messaages inside the useEffect hook
    socket.on('message', (message) => {
          setMessages(prev => [...prev, message]);
        });


//adding a closing logic once the message is sent, the socket.off function cleares the listenres on the message event

return () => {
      socket.off('message');

    };


  }, []) // removing the user data from the useEffect dependency array because it's causing 
         // the infinte triggering of the /user endpoint, making it an empty array will call
         // it just once.





  return (
    <div className='flex flex-col gap-20'>
      {
        user &&
        <div>
          <h1 className='font-bold text-3xl flex flex-col gap-10'>User</h1>
          {JSON.stringify(user)}
        </div>
      }
      <div>
        <h1 className='font-bold text-3xl flex flex-col gap-10'>Messages</h1>
        <form onSubmit={handleSubmit} className='mt-5 flex gap-5'>
          <input type="text" className='border rounded-sm h-9' onChange={(e) => setMessage(e.target.value)} value={message} />
          <button type='submit' className='px-5 py-2 bg-green-400 rounded'>Send</button>
        </form>
        <ul>
          {messages?.map((item, index) => (

            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
