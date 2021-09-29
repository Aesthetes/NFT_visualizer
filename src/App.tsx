import NftForm from "./pages/nftForm/nftForm";
import NftData from "./pages/nftData/NftData";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to={"/testnet"} />} />
        <Route exact path="/:network" component={NftForm} />
        {/* <Route path="/:network/nft-data" component={NftData} /> */}
        <Route
          exact
          path="/:network/nft-data/:issuer/:id"
          component={NftData}
        />
      </Switch>
    </Router>
  );
}

export default App;
