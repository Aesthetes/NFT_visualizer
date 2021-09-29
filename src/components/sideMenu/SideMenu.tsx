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
          <div className="social-icon">
            <FaTwitter color="white" />
          </div>
          <div className="social-icon">
            <TiSocialLinkedin color="white" size="1.5rem" />
          </div>
          <div className="social-icon">
            <FaInstagram color="white" size="1.5rem" />
          </div>
          <div className="social-icon">
            <TiSocialFacebook color="white" size="1.5rem" />
          </div>
          <div className="social-icon">
            <AiOutlineYoutube color="white" size="1.5rem" />
          </div>
        </>
      )}
    </div>
  );
};

export default SideMenu;
