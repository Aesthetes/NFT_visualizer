import NftForm from "./pages/nftForm/nftForm";
import NftDataPage from "./pages/nftData/NftData";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/error/ErrorPage";
function App() {
  return (
    <Router>
      <Switch>
        {/* <Route exact path="/" component={ErrorPage} /> */}
        <Route exact path="/" render={() => <Redirect to={"/testnet"} />} />
        <Route exact path="/:network" component={NftForm} />
        {/* <Route path="/:network/nft-data" component={NftData} /> */}

        <Route
          exact
          path="/:network/nft-data/:issuer/:id"
          component={NftDataPage}
        />
        <Route exact path="/:network/error" component={ErrorPage} />
      </Switch>
    </Router>
  );
}

export default App;
