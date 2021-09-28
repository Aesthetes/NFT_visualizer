import { HiOutlineMenuAlt4 } from "react-icons/hi";
import "./navbar.scss";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-title">AESTHETES</div>
      <div className="nav-menu">
        <HiOutlineMenuAlt4 color="white" />
      </div>
    </div>
  );
};

export default Navbar;
