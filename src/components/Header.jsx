import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import logo from "https://hiperseco.com/web/images/brand.svg"

const Header = () => {

  return (
    <div
      className=" fixed top-0 left-0 flex h-[70px] w-full items-center justify-between  px-10 bg-barbieriRed z-50"
    >
      <Link to="/">
        <img className="" src={logo} alt="logo" />
      </Link>
    </div>
  );
};
export default Header;
