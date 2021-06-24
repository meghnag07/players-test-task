import { Route, Switch } from "react-router-dom";
import './assets/styles/index.css';

//routes
import Players from "./routes/players"

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/players" component={Players} />
        <Route exact path="/" component={Players} />
      </Switch>
    </div>
  );
}

export default App;
