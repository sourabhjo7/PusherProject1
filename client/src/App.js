import './App.css';

function App() {
  return (
    <div className="App">
      <div className="midContainer">
      <h2 id="inlabel">Choose Your Color</h2>
      <div className="inputCon">
     
      <input type="color"  
            value="#f6b73c"/>
      </div>
     
      <button className="btn" type="button"> Change</button>
     
      </div>
    </div>
  );
}

export default App;
