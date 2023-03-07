import { useState } from "react";
import { Link } from "react-router-dom";
import imgBase from "/public/base.png"
import imgVigas from "/public/vigas.png"
import imgVigasTubo from "/public/vigas-tubo.png"

const TipoDeAnalisis = () => {
  const [urlImg, setUrlImg] = useState(imgBase);

  return (
    <div className="my-10 mx-10 lg:mx-48 max-w-5xl ">
      <h2 className="text-3xl font-black text-barbieriBlue border-b pb-4 border-ligthGray">
        Analisis de carga
      </h2>
      <div className="flex flex-wrap md:flex-nowrap w-full max-w-2xl  md:justify-center md:gap-2 gap-10 text-xl text-barbieriBlue">
        <ul className="flex w-6/12 flex-col gap-1 mt-10">
          <Link to="/tipo-de-analisis/vigas">
            <li
              className="cursor-pointer hover:font-semibold text-xl py-1"
              onMouseOver={(e) => setUrlImg(imgVigas)}
              onMouseOut={(e) => setUrlImg(imgBase)}
            >
              Vigas
            </li>
          </Link>
          <li
            className="cursor-pointer hover:font-semibold text-xl py-1"
            onMouseOver={(e) => setUrlImg(imgVigasTubo)}
            onMouseOut={(e) => setUrlImg(imgBase)}
          >
            Vigas Tubo
          </li>
          <li className="cursor-pointer hover:font-semibold text-xl py-1">Montantes</li>
        </ul>
        <div className="w-full md:w-6/12">
          <img src={urlImg} alt="" />
        </div>
      </div>
    </div>
  );
};
export default TipoDeAnalisis;
