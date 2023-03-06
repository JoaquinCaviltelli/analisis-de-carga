import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Header = () => {
  let location = useLocation();
  const [navBarActive, setNavBarActive] = useState(false);

  return (
    <div
      className={`${
        location.pathname != "/" ? "bg-barbieriRed" : "bg-[#0000004a]"
      } fixed top-0 left-0 flex h-[70px] w-full items-center justify-between  px-10`}
    >
      <Link to="/">
        <img className="" src="logo.png" alt="" />
      </Link>
      {/* <nav className="flex gap-5 text-white">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/vigas">Vigas</NavLink>
        <NavLink to="/vigas-tubo">Vigas tubo</NavLink>
        <NavLink to="/montantes">Montantes</NavLink>
      </nav> */}
      <span
        onClick={() => setNavBarActive(true)}
        className="material-symbols-outlined py-3 pl-3 text-4xl font-black text-white"
      >
        menu
      </span>
      {navBarActive && <NavBar setNavBarActive={setNavBarActive} />}
    </div>
  );
};
export default Header;
