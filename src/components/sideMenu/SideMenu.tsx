import React from "react";
import { TiSocialLinkedin, TiSocialFacebook } from "react-icons/ti";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
import "./sideMenu.scss";
type SideMenuProps = {
  sideMenuVisible: boolean;
};
const SideMenu: React.FC<SideMenuProps> = ({ sideMenuVisible }) => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  return (
    <div
      className={
        isMobile ? "mobile-side-menu-container" : "side-menu-container"
      }
    >
      {sideMenuVisible && (
        <>
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
        </>
      )}
    </div>
  );
};

export default SideMenu;
