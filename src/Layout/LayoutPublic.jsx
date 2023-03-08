import { Outlet, useLocation, useNavigation } from "react-router-dom";

import Header from "../components/Header";

const LayoutPublic = () => {
  const navigation = useNavigation();
  let location = useLocation();

  return (
    <div className="">
      <Header />
      <main
        className={`${
          location.pathname != "/" && "min-h-screen pt-[70px]"
        } "min-h-screen"`}
      >
        {navigation.state === "loading" && <div className="">Loading...</div>}
        <Outlet />
      </main>
     
    </div>
  );
};
export default LayoutPublic;
