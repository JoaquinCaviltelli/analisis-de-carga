import { useState } from "react";
import { Link } from "react-router-dom";
import imgBase from "/src/assets/base.png";
import imgVigas from "/src/assets/vigas.png";
import imgVigasTubo from "/src/assets/vigas-tubo.png";
import imgMontantes from "/src/assets/montantes.png";
import imgColumnas from "/src/assets/columnas.png";
import { useDatosContext } from "../context/DatosContext";

const TipoDeAnalisis = () => {
  const [urlImg, setUrlImg] = useState(imgBase);
  const [urlTo, setUrlTo] = useState("");

  const { datos, setDatos } = useDatosContext();

  const salir = () => {
    setDatos({
      kgCarga: 0,
      aInf: 1,
    });
  };

  return (
    <div className="my-10 mx-10 max-w-5xl lg:mx-32 ">
      <h2 className="border-b border-ligthGray pb-4 text-3xl font-black text-barbieriBlue">
        Analisis de carga
      </h2>
      <div className="flex w-full max-w-2xl flex-wrap gap-10  text-xl text-barbieriBlue md:flex-nowrap md:justify-center md:gap-2">
        <ul className="mt-10 flex w-full flex-col items-start gap-1 md:w-6/12">
          <li
            className={`${
              urlTo == "/tipo-de-analisis/vigas" && "font-semibold"
            } cursor-pointer p-1 text-xl hover:font-semibold`}
            onClick={() => {
              setUrlImg(imgVigas);
              setUrlTo("/tipo-de-analisis/vigas");
            }}
          >
            Vigas
          </li>

          <li
            className={`${
              urlTo == "/tipo-de-analisis/vigas-tubo" && "font-semibold"
            } cursor-pointer p-1 text-xl hover:font-semibold`}
            onClick={() => {
              setUrlImg(imgVigasTubo);
              setUrlTo("/tipo-de-analisis/vigas-tubo");
            }}
          >
            Vigas Tubo y dinteles
          </li>

          <li
            className={`${
              urlTo == "/tipo-de-analisis/columnas" && "font-semibold"
            } cursor-pointer p-1 text-xl hover:font-semibold`}
            onClick={() => {
              setUrlImg(imgColumnas);
              setUrlTo("/tipo-de-analisis/columnas");
            }}
          >
            Columnas compuestas
          </li>

          <li
            className={`${
              urlTo == "/tipo-de-analisis/montantes" && "font-semibold"
            } cursor-pointer p-1 text-xl hover:font-semibold`}
            onClick={() => {
              setUrlImg(imgMontantes);
              setUrlTo("/tipo-de-analisis/montantes");
            }}
          >
            Montantes
          </li>

          <div className="flex gap-4">
            <Link to="/">
              <button
                onClick={salir}
                className="mt-5 rounded border border-barbieriBlue py-2 px-10 text-center text-sm text-barbieriBlue hover:border-barbieriRed hover:bg-barbieriRed hover:text-white"
              >
                Salir
              </button>
            </Link>
            <Link to={urlTo}>
              <button
                className={` ${
                  urlTo === ""
                    ? " bg-ligthGray text-gray"
                    : " bg-barbieriBlue text-white hover:bg-barbieriBlueFocus"
                } mt-5 rounded py-2 px-10 text-center text-sm`}
              >
                Calcular
              </button>
            </Link>
          </div>
        </ul>
        <div className="w-full md:w-6/12">
          <img src={urlImg} alt="" />
        </div>
      </div>
    </div>
  );
};
export default TipoDeAnalisis;
