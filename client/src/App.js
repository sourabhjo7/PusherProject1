import React,{useState,useEffect} from 'react'
import Pusher from 'pusher-js';
import axios from "axios"
import './App.css';

function App() {
  const [background,setBackground]= useState("#CDF6E5");
  const [input,setInput]= useState("#CDF6E5");
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_KEY
      ,{
      cluster: process.env.REACT_APP_CLUSTER
     });
    const channel = pusher.subscribe("client");
    channel.bind("suno-client", function(data) {
      setBackground(data.color)
      console.log("data==>",data);
     });
      }, [])
  
  const handleClick=async(e)=>{  
      // requesting server to do realtime trigger
      setBackground(input);
      await axios.post('http://localhost:5000/update',{color:input});
     
  }
    
    return (
      <div style={ {backgroundColor:background} } className="App">
      <div className="midContainer">
      <h2 id="inlabel">Choose Your Color</h2>
      <div className="inputCon">
     
      <input type="color" 
      onChange={(e)=>{
              setInput(e.target.value);
            }}
             value={input}/>
      </div>
      <button onClick={ handleClick} className="btn" type="button"> Change</button>
     
      </div>
    </div>
    )

}

export default App;



