import { Link, NavLink, useLocation } from "react-router-dom";

const Header = () => {
  let location = useLocation();

  return (
    <div
      className={`${
        location.pathname != "/" ? "bg-barbieriRed" : "bg-[#0000004a]"
      } fixed top-0 left-0 flex h-[70px] w-full items-center justify-between  px-10`}
    >
      <Link to="/">
        <img className="" src="logo.png" alt="" />
      </Link>
      <nav className="flex gap-5 text-white">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/vigas">Vigas</NavLink>
        <NavLink to="/vigas-tubo">Vigas tubo</NavLink>
        <NavLink to="/montantes">Montantes</NavLink>
      </nav>
    </div>
  );
};
export default Header;
