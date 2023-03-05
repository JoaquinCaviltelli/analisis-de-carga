import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 flex h-[70px] w-full items-center bg-barbieriRed">
      <Link to="/">
        <img className="px-10" src="logo.png" alt="" />
      </Link>
    </div>
  );
};
export default Header;
