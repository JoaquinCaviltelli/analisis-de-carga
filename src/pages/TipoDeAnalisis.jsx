import { useState } from "react";
import { Link } from "react-router-dom";
import imgBase from "/public/base.png";
import imgVigas from "/public/vigas.png";
import imgVigasTubo from "/public/vigas-tubo.png";


const TipoDeAnalisis = () => {
  const [urlImg, setUrlImg] = useState(imgBase);



  return (
    <div className="my-10 mx-10 max-w-5xl lg:mx-48 ">
      <h2 className="border-b border-ligthGray pb-4 text-3xl font-black text-barbieriBlue">
        Analisis de carga
      </h2>
      <div className="flex w-full max-w-2xl flex-wrap gap-10  text-xl text-barbieriBlue md:flex-nowrap md:justify-center md:gap-2">
        <ul className="mt-10 flex w-full flex-col items-start gap-1 md:w-6/12">
          <div className="flex items-center gap-1">
            <span
              onClick={(e) => setUrlImg(imgVigas)}
              className="material-symbols-outlined cursor-pointer p-1 text-lg leading-none"
            >
              info
            </span>
            <Link to="/tipo-de-analisis/vigas">
              <li
                className="cursor-pointer p-1 text-xl hover:font-semibold"
                onMouseOver={(e) => setUrlImg(imgVigas)}
                onMouseOut={(e) => setUrlImg(imgBase)}
              >
                Vigas
              </li>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span
              onClick={(e) => setUrlImg(imgVigasTubo)}
              className="material-symbols-outlined cursor-pointer p-1 text-lg leading-none"
            >
              info
            </span>
            <Link to="/tipo-de-analisis/vigas-tubo">
              <li
                className="cursor-pointer p-1 text-xl hover:font-semibold"
                onMouseOver={(e) => setUrlImg(imgVigasTubo)}
                onMouseOut={(e) => setUrlImg(imgBase)}
              >
                Vigas Tubo y dinteles
              </li>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined cursor-pointer p-1 text-lg leading-none">
              info
            </span>
            <Link to="/tipo-de-analisis/">
              <li className="cursor-pointer p-1 text-xl hover:font-semibold">
                Montantes
              </li>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined cursor-pointer p-1 text-lg leading-none">
              info
            </span>
            <Link to="/tipo-de-analisis/">
              <li className="cursor-pointer p-1 text-xl hover:font-semibold">
                Columnas compuestas
              </li>
            </Link>
          </div>
          <Link to="/">
            <button className="mt-5 rounded border border-barbieriBlue py-2 px-10 text-center text-sm text-barbieriBlue hover:border-barbieriRed hover:bg-barbieriRed hover:text-white">
              Atras
            </button>
          </Link>
        </ul>
        <div className="w-full md:w-6/12">
          <img src={urlImg} alt="" />
        </div>
      </div>
    </div>
  );
};
export default TipoDeAnalisis;
