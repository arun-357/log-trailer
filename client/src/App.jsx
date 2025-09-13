import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setmessages] = useState([]);
  const socketRef = useRef(null);

  async function start() {
    console.log('Client started');

    const ws = new WebSocket('ws://localhost:8080');
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Client WebSocket Connected');
    };

    ws.onmessage = (event) => {
      let payload;
      try {
        payload = JSON.parse(event.data);
      } catch (error) {
        console.log('Error Client Parsing: ', error);
      }
      
      if (payload.type === 'init' || payload.type === 'live') {
        setmessages(
          (prev) => [...prev, ...payload.data].slice(-10)
        )
      }
    }

    ws.onclose = () => {
      console.log('Client WebSocket Closed')
    }

    ws.onerror = () => {
      console.log('Client WebSocket Error')
    }
  }

  return (
    <>
      <div className='hero'>
        <div className="connect">
          <button onClick={start}>
            Connect
          </button>
        </div>

        <div className='messages'>
          {
            messages.map((message, idx) => (
              <div className='message' key={idx}>{message}</div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default App
