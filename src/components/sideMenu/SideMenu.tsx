import React from "react";
import { TiSocialLinkedin, TiSocialFacebook } from "react-icons/ti";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { useMediaQuery } from "react-responsive";
type SideMenuProps = {
  sideMenuVisible: boolean;
};
const SideMenu: React.FC<SideMenuProps> = ({ sideMenuVisible }) => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        position: "absolute",
        left: 0,
        justifyContent: "space-evenly",
        top: isMobile ? "100%" : "50%",
        transform: "translate(0%, -50%)",
        height: !isMobile ? "40vh" : "20vh",
        paddingLeft: !isMobile ? "4%" : "0",
        width: isMobile ? "100%" : "auto",
      }}
    >
      {sideMenuVisible && (
        <>
          <div className="social-icon" style={{ cursor: "pointer" }}>
            <FaTwitter color="white" />
          </div>
          <div className="social-icon" style={{ cursor: "pointer" }}>
            <TiSocialLinkedin color="white" size="1.5rem" />
          </div>
          <div className="social-icon" style={{ cursor: "pointer" }}>
            <FaInstagram color="white" size="1.5rem" />
          </div>
          <div className="social-icon" style={{ cursor: "pointer" }}>
            <TiSocialFacebook color="white" size="1.5rem" />
          </div>
          <div className="social-icon" style={{ cursor: "pointer" }}>
            <AiOutlineYoutube color="white" size="1.5rem" />
          </div>
        </>
      )}
    </div>
  );
};

export default SideMenu;
