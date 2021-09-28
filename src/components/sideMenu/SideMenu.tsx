import React from "react";
import { TiSocialLinkedin, TiSocialFacebook } from "react-icons/ti";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
type SideMenuProps = {
  sideMenuVisible: boolean;
};
const SideMenu: React.FC<SideMenuProps> = ({ sideMenuVisible }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        left: 0,
        justifyContent: "space-evenly",
        top: "50%",
        transform: "translate(0%, -50%)",
        height: "40vh",
        paddingLeft: "4%",
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
