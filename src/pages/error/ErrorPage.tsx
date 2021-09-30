import { useMediaQuery } from "react-responsive";
import Navbar from "../../components/navbar/Navbar";
import errorBackground from "../../images/SFONDO-NFT-NOT-FOUND.png";
import errorBackgroundMobile from "../../images/SFONDO-NFT-NOT-FOUND-MOBILE.png";
import "./errorPage.scss";
import { useHistory } from "react-router";
const ErrorPage = () => {
  const history = useHistory();
  const isMobile = useMediaQuery({
    query: "(max-width: 480px)",
  });
  return (
    <div>
      <Navbar />
      <div className="error-page-container">
        <img
          alt="error"
          src={isMobile ? errorBackgroundMobile : errorBackground}
          className="error-image"
        />
        <div className="back-btn">
          <div onClick={() => history.push("/")}>SEARCH ANOTHER NFT</div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
