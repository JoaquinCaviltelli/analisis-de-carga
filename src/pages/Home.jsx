import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className={`h-screen w-full bg-[url("/src/assets/bg-home.webp")] bg-cover bg-center bg-no-repeat pt-44`}
    >
      <div className="flex flex-col items-start gap-2 p-10">
        <p className="inline-block bg-barbieriBlue p-1 md:text-2xl font-light uppercase text-white ">
          Analisis de carga
        </p>
        <p className="py-2 px-1 text-6xl md:text-8xl font-extrabold uppercase text-white">
          Steel Frame
        </p>
        <Link to="/tipo-de-analisis">
          <button className="mt-3 md:mt-8 rounded bg-barbieriBlue py-2 text-xs md:text-lg px-10 uppercase text-white hover:bg-barbieriBlueFocus">
            Empezar
          </button>
        </Link>
      </div>
    </div>
  );
};
export default Home;
