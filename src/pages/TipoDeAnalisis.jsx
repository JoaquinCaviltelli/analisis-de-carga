import { useState } from "react";
import { Link } from "react-router-dom";

const TipoDeAnalisis = () => {
  const [urlImg, setUrlImg] = useState("public/base.png");

  return (
    <div className="my-10 mx-10 lg:mx-48 max-w-5xl ">
      <h2 className="text-3xl font-black text-barbieriBlue border-b pb-4 border-ligthGray">
        Analisis de carga
      </h2>
      <div className="flex  w-full max-w-2xl  justify-center gap-2 text-xl text-barbieriBlue">
        <ul className="flex w-6/12 flex-col gap-1 mt-10">
          <Link to="/tipo-de-analisis/vigas">
            <li
              className="cursor-pointer hover:font-semibold text-xl py-1"
              onMouseOver={(e) => setUrlImg("public/vigas.png")}
              onMouseOut={(e) => setUrlImg("public/base.png")}
            >
              Vigas
            </li>
          </Link>
          <li
            className="cursor-pointer hover:font-semibold text-xl py-1"
            onMouseOver={(e) => setUrlImg("public/vigas-tubo.png")}
            onMouseOut={(e) => setUrlImg("public/base.png")}
          >
            Vigas Tubo
          </li>
          <li className="cursor-pointer hover:font-semibold text-xl py-1">Montantes</li>
        </ul>
        <div className="border-1 w-6/12">
          <img src={urlImg} alt="" />
        </div>
      </div>
    </div>
  );
};
export default TipoDeAnalisis;
