import './App.css';
import Game from './components/Game';
import {PORT} from "./utils/constants"

function App() {
  let playerRole = "x" // two roles x or o
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
  
  // init()
  return (
    <div className="App flex flex-col items-center justify-center bg-emerald-200 h-screen">
      <h2 className='text-3xl'>hello</h2>
      <Game playerRole={playerRole}/>
    </div>
  );
}

export default App;
