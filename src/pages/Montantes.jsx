import { Toast } from "../components/Toast";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDatosContext } from "../context/DatosContext";

import montantes from "../database/montantes.json";
import montantes150 from "../database/montantes150.json";
import zonas from "../database/zonas.json";

import imgPerfil from "/src/assets/perfil.png";
import imgAinf from "/src/assets/luz-de-apoyo.png";
import imgViento from "/src/assets/viento.png";
import BtnBack from "../components/BtnBack";
import BtnSubmit from "../components/BtnSubmit";
import TextFooter from "../components/TextFooter";

const Montantes = () => {
  //datos del formulario
  const [dataForm, setDataForm] = useState({
    kgCarga: 0,
    kgTerminacion: 28,
    altoPerfil: 0,
    aInf: 1,
    ubicacion: "Seleccionar",
    exposicion: "A",
    separacion: 0.4,
  });
  var { kgCarga, altoPerfil, aInf } = dataForm;
  
  const { datos, setDatos } = useDatosContext();
  
  useEffect(() => {
    setDataForm({
      ...dataForm,
      kgCarga: datos.kgCarga,
      aInf: datos.largo,
    });
  }, [datos]);
  

  //cargas de viento y nieve segun la zona (por defecto Cordoba)
  const [zonaActual, setZonaActual] = useState({
    viento: 0,
  });
  //exposicion del viento (por defecto tipo C)
  const [exposicionViento, setExposicionViento] = useState({
    wm: 7,
  });

  //carga de viento segun la zona y la exposicion
  const [cargaViento, setCargaViento] = useState({
    wm: 0,
  });

  const [valoresQ, setValoresQ] = useState({
    qc: 0,
    qd: 0,
  });

  const [kgTotales, setKgTotales] = useState(0);

  useEffect(() => {
    setValoresQ({
      qc:
        Number(dataForm.kgCarga * ((dataForm.aInf / 2) * dataForm.separacion)) /
        100,
      qd: Number(
        dataForm.altoPerfil *
          dataForm.separacion *
          (dataForm.kgTerminacion / 100)
      ),
    });
  }, [dataForm, kgTotales]);

  useEffect(() => {
    //se calcula la carga de precion y succion segun la zona y la expocicion
    setCargaViento({
      wm: Math.round(
        (Number(Math.pow(zonaActual.viento, 2)) / 100) *
          Number(exposicionViento.wm)
      ),
    });
  }, [zonaActual, exposicionViento]);


  useEffect(() => {
    //se modifica las cargas de viento y nieve segun la zona (se trae de un json)
    zonas.map((zona) => {
      zona.zona == dataForm.ubicacion &&
        setZonaActual({
          viento: zona.cargas.viento,
        });
    });
    //se modifica la exposicion
    dataForm.exposicion === "A" &&
      setExposicionViento({
        wm: 0,
      });
    dataForm.exposicion === "C" &&
      setExposicionViento({
        wm: 7,
      });
    dataForm.exposicion === "D" &&
      setExposicionViento({
        wm: 8.35,
      });
  }, [dataForm.exposicion, dataForm.ubicacion]);

  useEffect(() => {
    //se suma los kg de la cubierta, entrepiso, sobregarga y nieve
    setKgTotales(Math.round(Number(kgCarga) + Number(dataForm.kgTerminacion)));
  }, [kgCarga, dataForm]);

  const calcularPerfil = () => {
    let posiblesPerfiles = [];

    const result100 = montantes.some((item) => {
      if (cargaViento.wm / 100 <= item.viento) {
        return item.largos.some((largos) => {
          if (altoPerfil <= largos.largo) {
            return largos.cargas.some((cargas) => {
              if (valoresQ.qc + valoresQ.qd <= cargas.carga) {
                posiblesPerfiles.push(`100x${cargas.espesor}`);
                return true; // se retorna true para salir del bucle some
              }
            });
          }
        });
      }
    });

    const result150 = montantes150.some((item) => {
      if (cargaViento.wm / 100 <= item.viento) {
        return item.largos.some((largos) => {
          if (altoPerfil <= largos.largo) {
            return largos.cargas.some((cargas) => {
              if (valoresQ.qc + valoresQ.qd <= cargas.carga) {
                posiblesPerfiles.push(`150x${cargas.espesor}`);
                return true; // se retorna true para salir del bucle some
              }
            });
          }
        });
      }
    });


    if (!result150 && !result100) {
      Toast.fire({
        icon: "error",
        title: `No se encontró un perfil que cumpla con la condición.`,
      });
    } else {
      Swal.fire({
        title: `Se pueden utilizar PGC de: ${posiblesPerfiles.join(" - ")}`,
        showCloseButton: true,
        imageUrl: imgPerfil,
        imageHeight: 200,
        imageAlt: "Custom image",
        showConfirmButton: false,
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
        Analisis de cargas (montantes)
      </h2>
      <form
        className="mt-10 grid w-full max-w-2xl grid-cols-12  items-center gap-x-5 gap-y-1 text-sm "
        onSubmit={handelSubmit}
      >
        <label className="col-span-8">
          <b>Carga total (kg)</b>
          <span
            onClick={() =>
              info(
                "Carga Total",
                `Se puede calcular en el analisis de la viga`,
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
          <b>Tipo de terminacion exterior </b>({dataForm.kgTerminacion} kg/m2)
        </label>
        <select
          className=" col-span-4 h-full rounded border border-gray p-2 outline-none"
          name="kgTerminacion"
          onChange={handelChange}
        >
          <option value={28}>Eifs</option>
          <option value={40}>Superboard</option>
        </select>

        <label className="col-span-8">
          <b>Largo de la viga que apoya (m)</b>
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
          <b>Separacion entre perfiles:</b>{" "}
        </label>
        <select
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          name="separacion"
          onChange={handelChange}
        >
          <option value={0.4}>Cada 40cm</option>
          <option value={0.6}>Cada 60cm</option>
        </select>

        <label className="col-span-8">
          <b>Ubicacion </b>
          (Viento {zonaActual.viento} v/ms)
        </label>
        <select
          className=" col-span-4 h-full rounded border border-gray p-2 outline-none"
          onChange={handelChange}
          name="ubicacion"
        >
          {zonas.map((zona, index) => {
            return <option key={index}>{zona.zona}</option>;
          })}
        </select>
        <label className="col-span-8">
          <b> Exposicion del viento </b>
          (Wm: {exposicionViento.wm})
          <span
            onClick={() => info("", "", imgViento)}
            className="material-symbols-outlined cursor-pointer text-lg leading-none"
          >
            info
          </span>
        </label>
        <select
          className=" col-span-4 h-full rounded border border-gray p-2 outline-none"
          onChange={handelChange}
          name="exposicion"
        >
          <option value="A">Sin Exposicion</option>
          <option value="C">Urbana</option>
          <option value="D">Rural</option>
        </select>

        <label className="col-span-8">
          <b>Alto del perfil (m)</b>
        </label>
        <input
          autoComplete="off"
          required
          step="0.01"
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          type="number"
          name="altoPerfil"
          onChange={handelChange}
        />

        <div className="col-span-full p-2 text-right">
          <p>
            <b>Carga vertical</b>: {kgTotales} kg/m2
          </p>
          <p>
            <b>Carga viento</b>: {cargaViento.wm} kg/m2
          </p>
          <p>
            <b>qm</b>: {(valoresQ.qc + valoresQ.qd).toFixed(2)} kN/m2
          </p>
        </div>

        <BtnBack />
        <BtnSubmit />
      </form>
      <TextFooter />
    </div>
  );
};
export default Montantes;
