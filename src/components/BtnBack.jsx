import { Link } from "react-router-dom";

const BtnBack = () => {
  return (
    <Link
      className="col-span-6 rounded border border-barbieriBlue p-2 text-center text-barbieriBlue hover:border-barbieriRed hover:bg-barbieriRed hover:text-white"
      to="/tipo-de-analisis"
    >
      <button type="button">Atras</button>
    </Link>
  );
};

export default BtnBack;
