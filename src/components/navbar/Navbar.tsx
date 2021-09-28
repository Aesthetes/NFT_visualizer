import { HiOutlineMenuAlt4 } from "react-icons/hi";
import "./navbar.scss";
const Navbar = () => {
  return (
    <div className="navbar">
      <div
        className="nav-title"
        style={{ fontSize: "20px", fontWeight: "bolder", cursor: "pointer" }}
      >
        AESTHETES
      </div>
      <div
        className="nav-menu"
        style={{ fontSize: "20px", fontWeight: "bolder", cursor: "pointer" }}
      >
        <HiOutlineMenuAlt4 color="white" />
      </div>
    </div>
  );
};

export default Navbar;
