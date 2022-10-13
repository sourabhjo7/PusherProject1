import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import "./App.css";

function App() {
  const [background, setBackground] = useState("#CDF6E5");

  const [input, setInput] = useState("#CDF6E5");

  const [userCount, setUserCount] = useState();

  const url = `http://localhost:5000/users/${background.replace("#", "")}`;
  console.log("uuu-", url);

  const initial = async()=>{
    const pusher = new Pusher(process.env.REACT_APP_KEY, {
      cluster: process.env.REACT_APP_CLUSTER,
    });
    const channel = pusher.subscribe("client");

    await channel.bind("suno-client", (data) => {
      setBackground(data.color);
      console.log("data==>", data);
    });

    await channel.bind("setUserCount", (data) => {
      setUserCount(data.userCount);

      if(data.color){
        setBackground(data.color);
        setInput(data.color)
      }
    });

    setTimeout(async()=>{
      await axios.get(url);
    },100);

    //  now to have the count of users
    await window.addEventListener("unload", async () => {
      await axios.get(url);
    });
  };
  useEffect(() => {
    initial();
  }, []);

  const handleClick = async (e) => {
    // requesting server to do realtime trigger
    setBackground(input);
    await axios.post("http://localhost:5000/update", { color: input });
  };

  return (
    <div style={{ backgroundColor: background }} className="App">
      <h2 id="title">
        {[0, 1].includes(userCount) ? `Active User` : `Active Users`}:{" "}
        {userCount}
      </h2>
      <div className="midContainer">
        <h2 id="inlabel">Choose Your Color</h2>
        <div className="inputCon">
          <input
            type="color"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={background}
          />
        </div>
        <button onClick={handleClick} className="btn" type="button">
          {" "}
          Change
        </button>
      </div>
    </div>
  );
}

export default App;
