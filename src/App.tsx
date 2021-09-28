import NftForm from "./pages/nftForm/nftForm";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NftData from "./pages/nftData/NftData";
import "./App.css";
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={NftForm} />
        <Route path="/nft-data" component={NftData} />
      </Switch>
    </Router>
  );
}

export default App;
