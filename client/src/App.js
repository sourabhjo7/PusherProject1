import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import "./App.css";

function App() {
  const [imgURL, setImgURL] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [userCount, setUserCount] = useState();

  // console.log("uuu-", url);

  const initial = async()=>{
    const pusher = new Pusher(process.env.REACT_APP_KEY, {
      cluster: process.env.REACT_APP_CLUSTER,
    });
    const channel = pusher.subscribe("client");

    await channel.bind("suno-client", (data) => {
      // setBackground(data.color);
      console.log("Suno Client data==>", data);
      setImgURL(data.imgURL);
    });

    await channel.bind("setUserCount", (data) => {
      console.log("UserCount Data ===>", data);
      setUserCount(data.userCount);

      if(data.imgURL){
        setImgURL(data.imgURL);
        // setInput(data.color)
      }
    });

    const url = `http://localhost:5000/users`;
    setTimeout( async () => {
      console.log(imgURL);
      await axios.post(url, {imgURL: `${imgURL}`}).then(res => { // then print response status
        console.log(res.data);
      })
    }, 100);

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
    // setBackground(input);

    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    const newURL = 'http://localhost:5000/update'

    await axios.post(newURL, formData).then(res => { // then print response status
      console.log(res.data.imgURL);
      setImgURL(res.data.imgURL)
    })
    // console.log("Click", selectedFile);


    // try {
    //   // const response = await axios({
    //   //   method: "post",
    //   //   url: "http://localhost:5000/update",
    //   //   data: formData,
    //   //   headers: { "Content-Type": "multipart/form-data" },
    //   // });
    //
    //   console.log(response.imgURL);
    // } catch(error) {
    //   console.log(error)
    // }

    // await axios.post("http://localhost:5000/update", { color: "" });
  };

  return (
    <div className="App" style={{
      backgroundImage: `url("${imgURL}")`
    }}>
      <h2 id="title">
        {[0, 1].includes(userCount) ? `Active User` : `Active Users`}:{" "}
        {userCount}
      </h2>
      <div className="midContainer">

        <h2 id="inlabel">Choose Your File</h2>
        <div className="inputCon">
          {/*<input
            type="color"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            value={background}
          />*/}
          <input
            type="file"
            name="bgImg"
            onChange={(e) => {
              // console.log(e.target.files[0]);
              setSelectedFile(e.target.files[0]);
            }}
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
