import NftForm from "./pages/nftForm/nftForm";
import NftDataPage from "./pages/nftData/NftData";
import { ChakraProvider, theme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/error/ErrorPage";

import ReactGA from "react-ga";

delete theme.styles.global;

function App() {
  ReactGA.initialize("UA-211269498-1");
  ReactGA.pageview(window.location.pathname + window.location.search);

  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      <Router>
        <Switch>
          {/* <Route exact path="/" component={ErrorPage} /> */}
          <Route exact path="/" render={() => <Redirect to={"/mainnet"} />} />
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
    </ChakraProvider>
  );
}

export default App;
