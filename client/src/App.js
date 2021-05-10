import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="pictures">
        <img id = "photo"/>
        <canvas id="canvas" width="320" height="240" ></canvas>
      </div>  
      <div>
        <BrowserRouter>
        <Switch>
          <Route path="/" exact component={CreateRoom} />
          <Route path="/room/:roomID" component={Room} />
        </Switch>
      </BrowserRouter>
      </div>
    </div>
  );
}

export default App;