import { Link } from "react-router-dom";

const Montantes = () => {
  return (
    <>
      <h2 className="m-5 text-lg font-semibold text-gray">En produccion...</h2>
      <Link to="/tipo-de-analisis">
        <button className="mx-6 rounded border border-barbieriBlue py-2 px-10 text-center text-sm text-barbieriBlue hover:border-barbieriRed hover:bg-barbieriRed hover:text-white">
          Atras
        </button>
      </Link>
    </>
  );
};
export default Montantes;
