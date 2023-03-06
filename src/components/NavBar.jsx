import { NavLink } from "react-router-dom";

const NavBar = ({setNavBarActive}) => { 
    return (
      <div className="fixed top-0 left-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#000000ec] text-3xl text-white">
        <NavLink onClick={() => setNavBarActive(false)} to="/">
          Inicio
        </NavLink>
        <NavLink onClick={() => setNavBarActive(false)} to="/vigas">
          Vigas
        </NavLink>
        <NavLink onClick={() => setNavBarActive(false)} to="/vigas-tubo">
          Vigas tubo
        </NavLink>
        <NavLink onClick={() => setNavBarActive(false)} to="/montantes">
          Montantes
        </NavLink>
      </div>
    );
}
export default NavBar