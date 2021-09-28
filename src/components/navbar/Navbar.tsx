import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { useMediaQuery } from "react-responsive";
import Logo from "../../images/logo";
import "./navbar.scss";
const Navbar = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  return (
    <div className="navbar">
      {!isMobile && (
        <div
          className="nav-title"
          style={{ fontSize: "20px", fontWeight: "bolder", cursor: "pointer" }}
        >
          AESTHETES
        </div>
      )}
      {isMobile && (
        <div className="logo-div">
          <Logo />
        </div>
      )}
      <div
        className="nav-menu"
        style={{
          cursor: "pointer",
        }}
      >
        <HiOutlineMenuAlt4 color="white" size="30" />
      </div>
    </div>
  );
};

export default Navbar;
