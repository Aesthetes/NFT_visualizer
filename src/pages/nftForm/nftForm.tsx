import { useHistory } from "react-router-dom";
import "./nftForm.scss";
import background from "../../images/background.jpg";
import Navbar from "../../components/navbar/Navbar";
import SideMenu from "../../components/sideMenu/SideMenu";

const NftForm = () => {
  let history = useHistory();
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <SideMenu sideMenuVisible />
      <div className="form-container">
        <h1>Visualize a NFT</h1>
        <p>
          Visualize all NFTs minted according to the Aesthetes's standards.
          <br />
          <br />
          Join the XRPL NFTs revolution
        </p>

        <div className="form">
          <div className="form-input">
            <input placeholder="Address of the NFT Issuer" />
            <input placeholder="Identifier of the NFT (currency name)" />
          </div>
          <div className="radio-btn-container">
            <div className="radio-container">
              <input type="radio" name="testnet" checked />
              <p>Testnet</p>
            </div>
            <div className="radio-container">
              <input type="radio" name="mainnet" />
              <p>Mainnet</p>
            </div>
          </div>
          <div className="btn-container">
            <button id="action-btn" onClick={() => history.push("/nft-data")}>
              VISUALIZE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftForm;
