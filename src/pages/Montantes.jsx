import columnas from "../columnas.json";
import { Toast } from "../components/Toast";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imgPerfil from "/src/assets/columna.png";
import imgAinf from "/src/assets/columna-ainf.png";
import { useDatosContext } from "../context/DatosContext";
import zonas from "../zonas.json";
import imgViento from "/src/assets/viento.png";

const Montantes = () => {
  //datos del formulario
  const [dataForm, setDataForm] = useState({
    kgCarga: 0,
    kgTerminacion: 28,
    altoColumna: 0,
    aInf: 1,
    ubicacion: "Seleccionar",
    exposicion: "C",
  });

  const { datos, setDatos } = useDatosContext();

  useEffect(() => {
    setDataForm({
      ...dataForm,
      kgCarga: datos.kgCarga,
      aInf: datos.aInf,
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

  const [valores, setValores] = useState({
    qc: 0,
    qd: 0,
  });

  useEffect(() => {
    setValores({
      qc: Number(kgTotales * (dataForm.aInf * 0.4)) / 100,
      qd: Number(dataForm.altoColumna * 0.4 * 0.28),
    });
  }, [dataForm]);

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
    setDataForm({
      ...dataForm,
      kgCarga: datos.kgCarga,
      aInf: datos.aInf,
    });
  }, [datos]);

  useEffect(() => {
    //se modifica las cargas de viento y nieve segun la zona (se trae de un json)
    zonas.map((zona) => {
      zona.zona == dataForm.ubicacion &&
        setZonaActual({
          viento: zona.cargas.viento,
        });
    });
    //se modifica la exposicion
    dataForm.exposicion === "C" &&
      setExposicionViento({
        wm: 7,
      });
    dataForm.exposicion === "D" &&
      setExposicionViento({
        wm: 8.35,
      });
  }, [dataForm.exposicion, dataForm.ubicacion]);

  var { kgCarga, altoColumna, aInf } = dataForm;

  // suma los kg de la cubierta, entrepiso, sobregarga y nieve
  const [kgTotales, setKgTotales] = useState(0);

  useEffect(() => {
    //se suma los kg de la cubierta, entrepiso, sobregarga y nieve
    setKgTotales(Math.round(Number(kgCarga) + Number(dataForm.kgTerminacion)));
  }, [kgCarga, dataForm]);

  const calcularPerfil = () => {
    //se redonde hacia arriba la luz de apoyo para que sea igual al de la tabla
    var largoRounded = altoColumna < 2.5 ? 2.5 : Math.ceil(altoColumna * 4) / 4;
    var kgRounded = kgTotales < 3000 ? 3000 : Math.ceil(kgTotales / 500) * 500;

    if (altoColumna > 4) {
      return Toast.fire({
        icon: "error",
        title: "El largo maximo que verifica la tabla es de 4m",
      });
    }

    columnas.map((item) => {
      if (item.largo == largoRounded) {
        item.carga.map((carga) => {
          if (carga.q === kgRounded) {
            Swal.fire({
              title: `Columna: ${carga.perfil}`,
              text: `2 ${carga.perfil} mm y 2 pgu de 100x0.9`,
              showCloseButton: true,
              imageUrl: imgPerfil,
              imageHeight: 200,
              imageAlt: "Custom image",
              showConfirmButton: false,
            });
          } else if (kgRounded > carga.q) {
            return Toast.fire({
              icon: "error",
              title: `Se ha superado los kg en un largo de ${altoColumna}m`,
            });
          }
        });
      }
    });
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
          <option value="C">Tipo C</option>
          <option value="D">Tipo D</option>
        </select>

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
          <p>
            <b>Carga viento</b>: {cargaViento.wm} kg/m2
          </p>
          <p>
            <b>qm</b>: {(valores.qc + valores.qd).toFixed(2)} kN/m2
          </p>
        </div>

        <Link
          className="col-span-6 rounded border border-barbieriBlue p-2 text-center text-barbieriBlue hover:border-barbieriRed hover:bg-barbieriRed hover:text-white"
          to="/tipo-de-analisis"
        >
          <button type="button">Atras</button>
        </Link>
        <button
          type="submit"
          className="col-span-6 rounded bg-barbieriBlue p-2 text-white hover:bg-barbieriBlueFocus"
        >
          Calcular
        </button>
      </form>
      <p className="mt-6 text-xs">
        *El calculo realizado es a modo de referencia, recomendamos verificarlo
        con un profesional
      </p>
    </div>
  );
};
export default Montantes;
