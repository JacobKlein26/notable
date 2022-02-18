import "./App.css";
import { BrowserRouter as Router, Switch, Route, Routes } from "react-router-dom";
import Header from "./header/Header.js";
import Physicians from "./physicians/Physicians.js";
function App() {
  return (
    <>
      <Header />
      <Router>
        <Switch>
          <Route path="/">
            <Physicians />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
