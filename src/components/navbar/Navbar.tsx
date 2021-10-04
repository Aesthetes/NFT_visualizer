import { useMediaQuery } from "react-responsive";
import Logo from "../../images/logo";
import logoAesthetes from "../../images/logo_aesthetes.png";
import "./navbar.scss";
import { TiSocialLinkedin, TiSocialFacebook } from "react-icons/ti";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
const Navbar = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  return (
    <div className="navbar">
      {!isMobile && (
        <div className="nav-title" style={{ cursor: "pointer" }}>
          <img
            alt="logo-aesthetes"
            src={logoAesthetes}
            width={150}
            height={"auto"}
            onClick={() => window.open("http://www.aesthetes.art")}
          />
        </div>
      )}
      {isMobile && (
        <div className="navbar-mobile">
          <div className="logo-div-mobile">
            <Logo />
          </div>
          <div className="social-container-mobile">
            <div
              className="social-icon"
              onClick={() => window.open("https://twitter.com/aesthetes_art")}
            >
              <FaTwitter color="white" />
            </div>
            <div
              className="social-icon"
              onClick={() =>
                window.open("https://www.linkedin.com/company/71714406/admin/")
              }
            >
              <TiSocialLinkedin color="white" size="1.5rem" />
            </div>
            <div
              className="social-icon"
              onClick={() =>
                window.open("https://www.instagram.com/aesthetes_fineart/")
              }
            >
              <FaInstagram color="white" size="1.5rem" />
            </div>
            <div
              className="social-icon"
              onClick={() =>
                window.open("https://www.facebook.com/aesthetes.fineart/")
              }
            >
              <TiSocialFacebook color="white" size="1.5rem" />
            </div>
            <div
              className="social-icon"
              onClick={() => window.open("https://www.youtube.com/c/Aesthetes")}
            >
              <AiOutlineYoutube color="white" size="1.5rem" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
