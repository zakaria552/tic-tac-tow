import './App.css';
import {PORT} from "./utils/constants"

function App() {
  const url = `ws://localhost:${PORT}`
  let wsClient;
  const init = () => {
    wsClient = new WebSocket(url)
    wsClient.onopen = () => {
      const message = {payload: {message: "hello from react"}}
      console.log("connection established")
      wsClient.send(JSON.stringify(message))
    }
    wsClient.onmessage = (messageEvent) => {
      console.log(messageEvent.data)
    }
  }
  
  init()
  return (
    <div className="App">
      <h2 className='text-3xl'>hello</h2>
      <button className="border-2" >start connection</button>
    </div>
  );
}

export default App;
