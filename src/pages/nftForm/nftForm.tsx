import { useHistory } from "react-router-dom";
import "./nftForm.scss";
import background from "../../images/background.jpg";
import Navbar from "../../components/navbar/Navbar";

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
      <div className="form-container">
        <h3>Visualize a NFT</h3>
        <p>
          Visualize all NFTs minted according to the Aesthetes's standards.
          <br />
          <br />
          Join the XRPL NFTs revolution
        </p>

        <div className="input-container">
          <input placeholder="Address of the NFT Issuer" />
          <input placeholder="Identifier of the NFT (currency name)" />
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
