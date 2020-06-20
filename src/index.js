import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import ScheduleInterviewForm from "./components/ScheduleInterviewForm";

import ovLogo from "./assets/img/VeriKlick-Logo.png";
import "bootstrap/dist/css/bootstrap.css";
import "react-datepicker/dist/react-datepicker.css";
import VideoComponent from "./components/VideoComponent";

ReactDOM.render(
  <div>
    <header className="App-header">
      <img src={ovLogo} className="App-logo" alt="logo" />
    </header>
    <div id="title">
      <a
        href="http://www.openvidu.io/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* <img src={ovLogo2} className="mainLogo" alt="logo" /> */}
      </a>
    </div>
    <Router>
      <div>
        <Route exact path="/" component={ScheduleInterviewForm} />
        <Route path="/video" component={VideoComponent} />
        <Route path="/app" component={App} />
      </div>
    </Router>
  </div>,

  document.getElementById("root")
);
registerServiceWorker();
