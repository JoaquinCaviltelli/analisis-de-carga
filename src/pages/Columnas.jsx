import Swal from "sweetalert2";
import columnas from "../database/columnas.json";
import { Toast } from "../components/Toast";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imgPerfil from "/src/assets/columna.png";
import imgAinf from "/src/assets/columna-ainf.png";
import { useDatosContext } from "../context/DatosContext";
import BtnBack from "../components/BtnBack";
import BtnSubmit from "../components/BtnSubmit";
import TextFooter from "../components/TextFooter";

const Columnas = () => {
  //datos del formulario
  const [dataForm, setDataForm] = useState({
    kgCarga: 0,
    altoColumna: 0,
    aInf: 1,
  });

  const { datos, setDatos } = useDatosContext();

  useEffect(() => {
    setDataForm({
      ...dataForm,
      kgCarga: datos.kgCarga,
      aInf: datos.largo,
    });
  }, [datos]);

  var { kgCarga, altoColumna, aInf } = dataForm;

  // suma los kg de la cubierta, entrepiso, sobregarga y nieve
  const [kgTotales, setKgTotales] = useState(0);

  useEffect(() => {
    //se suma los kg de la cubierta, entrepiso, sobregarga y nieve
    setKgTotales(Math.round(Number(kgCarga) * Number(aInf)));
  }, [kgCarga, altoColumna, aInf]);

  const calcularPerfil = () => {


    if (altoColumna > 4) {
      return Toast.fire({
        icon: "error",
        title: "El largo maximo que verifica la tabla es de 4m",
      });
    }

    const result = columnas.some((item) => {
      if (item.largo >= altoColumna) {
       return item.carga.some((carga) => {
          if (carga.q >= kgTotales) {
            Swal.fire({
              title: `Columna: ${carga.perfil}`,
              text: `2 ${carga.perfil} mm y 2 pgu de 100x0.9`,
              showCloseButton: true,
              imageUrl: imgPerfil,
              imageHeight: 200,
              imageAlt: "Custom image",
              showConfirmButton: false,
            });
            return true
          } 
          
        });
      }
    });
    if (!result) {
      return Toast.fire({
        icon: "error",
        title: `Se ha superado los kg en un largo de ${altoColumna}m`,
      });
    }
    
    
  };

  //modal con la informacion
  const info = (title, text, img) => {
    Swal.fire({
      title: title,
      footer: text,
      imageUrl: img,
      imageAlt: "Custom image",
      showConfirmButton: false,
      showCloseButton: true,
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    calcularPerfil();
  };
  const handelChange = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="my-10 mx-10 max-w-5xl text-gray lg:mx-32">
      <h2 className="border-b border-ligthGray pb-4 text-3xl font-black text-barbieriBlue">
        Analisis de cargas (columnas)
      </h2>
      <form
        className="mt-10 grid w-full max-w-2xl grid-cols-12  items-center gap-x-5 gap-y-1 text-sm "
        onSubmit={handelSubmit}
      >
        <label className="col-span-8">
          <b>Carga (kg)</b>
          <span
            onClick={() =>
              info(
                "Carga Total",
                `Se puede calcular en el analisis de la viga tubo `,
                ""
              )
            }
            className="material-symbols-outlined cursor-pointer text-lg leading-none"
          >
            info
          </span>
        </label>
        <input
          autoComplete="off"
          required
          step="0.01"
          className={` ${
            datos.kgCarga > 0 && ""
          } col-span-4 h-full rounded border border-gray p-2 outline-none`}
          type="number"
          name="kgCarga"
          onChange={handelChange}
          value={kgCarga}
        />
        <label className="col-span-8">
          <b>Area de inlfuencia (m)</b>
          <span
            onClick={() =>
              info(
                "Area de influencia",
                "La mitad de la viga que apoya",
                imgAinf
              )
            }
            className="material-symbols-outlined cursor-pointer text-lg leading-none"
          >
            info
          </span>
        </label>
        <input
          autoComplete="off"
          required
          step="0.01"
          className={` ${
            datos.kgCarga > 0 && ""
          } col-span-4 h-full rounded border border-gray p-2 outline-none`}
          type="number"
          name="aInf"
          onChange={handelChange}
          value={aInf}
        />
        <label className="col-span-8">
          <b>Alto de la columna (m)</b>
        </label>
        <input
          autoComplete="off"
          required
          step="0.01"
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          type="number"
          name="altoColumna"
          onChange={handelChange}
        />

        <div className="col-span-full p-2 text-right">
          <p>
            <b>Carga vertical</b> (Q*L/2): {kgTotales} kg/m2
          </p>
        </div>

        <BtnBack />
        <BtnSubmit />
      </form>
      <TextFooter/>
    </div>
  );
};
export default Columnas;
