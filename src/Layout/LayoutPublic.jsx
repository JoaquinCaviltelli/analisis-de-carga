import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const LayoutPublic = () => {
  const navigation = useNavigation();

  return (
    <div className="min-h-screen relative pt-[70px]">
      <Header />
      <main className="pb-32">
        {navigation.state === "loading" && <div className="">Loading...</div>}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default LayoutPublic;
