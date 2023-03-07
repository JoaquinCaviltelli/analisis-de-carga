import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen w-full bg-[url(https://www.adbarbieri.com/hs-fs/hubfs/2022/Productos_y_Servicios/Steel_Frame/header-product.jpg?width=2000&name=header-product.jpg)] bg-cover bg-center bg-no-repeat pt-44">
      <div className="p-10 flex flex-col items-start gap-5">
        <p className="inline-block bg-barbieriBlue p-1 text-2xl font-light uppercase text-white ">
          Analisis de carga
        </p>
        <p className="text-8xl font-extrabold uppercase text-white">
          Steel Frame
        </p>
        <Link to="/tipo-de-analisis">
        <button className="bg-barbieriBlue text-white py-2 px-10 rounded uppercase mt-3">Empezar</button>
        </Link>
      </div>
    </div>
  );
};
export default Home;
