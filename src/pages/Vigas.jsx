import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import Result from "../components/Result";
const Vigas = () => {
  const [data, setData] = useState([]);
  const [zonas, setZonas] = useState([]);

  const fetchZonas = async () => {
    try {
      const response = await fetch(
        "https://joaquincaviltelli.github.io/base-de-datos/zonas.json"
      );
      if (!response.ok) {
        throw "Error al conectar la API";
      }
      const data = await response.json();
      setZonas(data);
    } catch (error) {
      console.log(error);
      setZonas([]);
    }
  };

  const fetchTabla = async () => {
    try {
      const response = await fetch(
        "https://joaquincaviltelli.github.io/base-de-datos/tabla.json"
      );
      if (!response.ok) {
        throw "Error al conectar la API";
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchTabla();
    fetchZonas();
  }, []);

  //datos del formulario
  const [dataForm, setDataForm] = useState({
    kgCubierta: 35,
    kgEntrepiso: 0,
    kgSobrecarga: 96,
    luz: 0,
    separacion: 40,
    ubicacion: "Seleccionar",
    exposicion: "C",
  });

  var {
    kgCubierta,
    kgEntrepiso,
    kgSobrecarga,
    luz,
    separacion,
    ubicacion,
    exposicion,
  } = dataForm;

  // suma los kg de la cubierta, entrepiso, sobregarga y nieve
  const [kgTotales, setKgTotales] = useState(0);

  //carga de viento segun la zona y la exposicion
  const [cargaViento, setCargaViento] = useState({
    wp: 0,
    ws: 0,
  });

  //exposicion del viento (por defecto tipo C)
  const [exposicionViento, setExposicionViento] = useState({
    wp: 2.74,
    ws: 8.72,
  });

  //cargas de viento y nieve segun la zona (por defecto Cordoba)
  const [zonaActual, setZonaActual] = useState({
    nieve: 0,
    viento: 0,
  });

  //se toma el valor maximo entre la carga vertical (kgTotales) y las cargas verticales (precion y succion)
  const [valorMaximo, setValorMaximo] = useState("");

  //si el perfil verifica entra en esta constante
  const [posiblesPerfiles, setPosiblesPerfiles] = useState([]);

  useEffect(() => {
    //se modifica la sobrecarga si existe entrepiso
    kgEntrepiso > 0 ? (kgSobrecarga = 200) : (kgSobrecarga = 96);
  }, [kgEntrepiso]);

  useEffect(() => {
    //se modifica las cargas de viento y nieve segun la zona (se trae de un json)
    zonas.map((zona) => {
      zona.zona == ubicacion &&
        setZonaActual({
          nieve: zona.cargas.nieve,
          viento: zona.cargas.viento,
        });
    });
    //se modifica la exposicion
    exposicion === "C" &&
      setExposicionViento({
        wp: 2.74,
        ws: 8.72,
      });
    exposicion === "D" &&
      setExposicionViento({
        wp: 3.27,
        ws: 10.39,
      });
  }, [exposicion, ubicacion]);

  useEffect(() => {
    //se calcula la carga de precion y succion segun la zona y la expocicion
    setCargaViento({
      wp: Math.round(
        (Number(Math.pow(zonaActual.viento, 2)) / 100) *
          Number(exposicionViento.wp) +
          Number(kgCubierta)
      ),
      ws: Math.round(
        (Number(Math.pow(zonaActual.viento, 2)) / 100) *
          Number(exposicionViento.ws) -
          Number(kgCubierta)
      ),
    });
  }, [zonaActual, exposicionViento, kgCubierta]);

  useEffect(() => {
    //se suma los kg de la cubierta, entrepiso, sobregarga y nieve
    setKgTotales(
      Math.round(
        Number(kgSobrecarga) +
          Number(kgCubierta) +
          Number(kgEntrepiso) +
          Number(zonaActual.nieve)
      )
    );
  }, [kgSobrecarga, kgCubierta, kgEntrepiso, zonaActual.nieve]);

  useEffect(() => {
    setValorMaximo(Math.max(kgTotales, cargaViento.wp, cargaViento.ws));
  }, [kgTotales, cargaViento]);

  const calcularPerfil = () => {
    setPosiblesPerfiles([]);

    //se redonde hacia arriba la luz de apoyo para que sea igual al de la tabla
    var luzRounded = luz < 2.5 ? 2.5 : Math.ceil(luz * 2) / 2;

    data.map((item) => {
      if (item.largo == luzRounded) {
        //separacion cada 40cm
        if (separacion == 40) {
          item.s40.map((perfil) => {
            if (
              perfil.resistencia > valorMaximo / 100 &&
              perfil.deformacion > valorMaximo / 100
            ) {
              setPosiblesPerfiles((prev) => [...prev, perfil]);
            }
          });
        }
        //separacion cada 60cm
        if (separacion == 60) {
          item.s60.map((perfil) => {
            if (
              perfil.resistencia > valorMaximo / 100 &&
              perfil.deformacion > valorMaximo / 100
            ) {
              setPosiblesPerfiles((prev) => [...prev, perfil]);
            }
          });
        }
      }
    });
  };

  //modal con la informacion
  const info = (title, text, img) => {
    Swal.fire({
      title: title,
      text: text,
      imageUrl: img,
      imageAlt: "Custom image",
      confirmButtonColor: "#022a3a",
    });
  };

  useEffect(() => {
    if (posiblesPerfiles.length > 0) {
      Swal.fire({
        title: `${posiblesPerfiles[0].perfil} mm`,
        text: `Para una luz de ${dataForm.luz}m y una carga de ${valorMaximo}kg/m2 se
            necesita un perfil de${posiblesPerfiles[0].perfil} mm
            que tiene una deformacion de ${posiblesPerfiles[0].deformacion} y una
            resistencia de ${posiblesPerfiles[0].resistencia} segun la tabla del
            cirsoc para vigas`,
        imageUrl:
          "https://btoc.ferreteriaargentina.com.ar/1313-large_default/perfil-pgc200-e129-x-6m-barbieri.jpg",
        imageHeight: 200,
        imageAlt: "Custom image",
      });
    }
  }, [posiblesPerfiles]);

  const handelSubmit = (e) => {
    e.preventDefault();

    calcularPerfil();
  };
  const handelChange = (e) => {
    setPosiblesPerfiles([]);
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="m-10 flex flex-wrap gap-10 text-gray">
      <h1 className=" w-full text-2xl font-bold">Analisis de cargas (vigas)</h1>
      <form
        className=" grid w-full max-w-3xl  grid-cols-12 items-center gap-x-4 gap-y-1 text-sm md:w-8/12  "
        onSubmit={handelSubmit}
      >
        <label className="col-span-8">
          Tipo de cubierta <b>({kgCubierta} kg/m2) </b>
        </label>
        <select
          className=" col-span-4 rounded border border-gray p-2 outline-none"
          name="kgCubierta"
          onChange={handelChange}
        >
          <option value={35}>Chapa</option>
          <option value={85}>Teja</option>
          <option value={180}>Cubierta plana</option>
          <option value={0}>No</option>
        </select>

        <label className="col-span-8">
          Entrepiso <b>({kgEntrepiso} kg/m2)</b>
        </label>
        <select
          className=" col-span-4 rounded border border-gray p-2 outline-none"
          name="kgEntrepiso"
          onChange={handelChange}
        >
          <option value={0}>No</option>
          <option value={50}>Seco s/placa cementicia</option>
          <option value={90}>Seco c/placa cementicia</option>
          <option value={160}>Humedo</option>
        </select>

        <label className="col-span-8">
          Sobrecarga <b>({kgSobrecarga} kg/m2)</b>
          <span
            onClick={() =>
              info(
                "",
                "",
                "https://joaquincaviltelli.github.io/base-de-datos/sobrecarga.PNG"
              )
            }
            className="material-symbols-outlined cursor-pointer text-lg "
          >
            info
          </span>
        </label>
        <input
          min="0"
          className="col-span-4 rounded border border-gray p-2 outline-none"
          type="number"
          name="kgSobrecarga"
          onChange={handelChange}
          value={kgSobrecarga}
        />
        <label className="col-span-8">
          Ubicacion{" "}
          <b>
            (Nieve:{zonaActual.nieve} kg/m2 - Viento {zonaActual.viento} v/ms)
          </b>
        </label>
        <select
          className=" col-span-4 rounded border border-gray p-2 outline-none"
          onChange={handelChange}
          name="ubicacion"
        >
          {zonas.map((zona, index) => {
            return <option key={index}>{zona.zona}</option>;
          })}
        </select>
        <label className="col-span-8">
          Exposicion del viento{" "}
          <b>
            (Wp: {exposicionViento.wp} Ws: {exposicionViento.ws})
          </b>
          <span
            onClick={() =>
              info(
                "Exposicion del viento",
                "",
                "https://joaquincaviltelli.github.io/base-de-datos/exposicion-viento.PNG"
              )
            }
            className="material-symbols-outlined cursor-pointer text-lg"
          >
            info
          </span>
        </label>
        <select
          className=" col-span-4 rounded border border-gray p-2 outline-none"
          onChange={handelChange}
          name="exposicion"
        >
          <option value="C">Tipo C</option>
          <option value="D">Tipo D</option>
        </select>

        <label className="col-span-8">
          Luz de apoyo
          <span
            onClick={() =>
              info(
                "Luz de apoyo",
                "En este caso la distancia total es de 8m, pero la luz de apoyo es de 5m ya que hay una viga que divide las luces",
                "https://joaquincaviltelli.github.io/base-de-datos/luz-de-apoyo.jpeg"
              )
            }
            className="material-symbols-outlined cursor-pointer text-lg"
          >
            info
          </span>
        </label>
        <input
          autoComplete="off"
          required
          step="0.01"
          className="col-span-4 rounded border border-gray p-2 outline-none"
          type="number"
          name="luz"
          onChange={handelChange}
        />
        <label className="col-span-8">Separacion entre perfiles: </label>
        <select
          className="col-span-4 rounded border border-gray p-2 outline-none"
          name="separacion"
          onChange={handelChange}
        >
          <option value={40}>Cada 40cm</option>
          <option value={60}>Cada 60cm</option>
        </select>

        <div className="col-span-full p-2 text-right">
          <p>
            Total: <b>{kgTotales} kg/m2</b>
          </p>
          <p>
            Carga de viento presion: <b>{cargaViento.wp} kg/m2</b>
          </p>
          <p>
            Carga de viento succion: <b>{cargaViento.ws} kg/m2</b>
          </p>
        </div>

        <button className="col-span-full rounded bg-barbieriBlue p-2 text-white">
          Calcular
        </button>
      </form>

      {/* <Result
        posiblesPerfiles={posiblesPerfiles}
        dataForm={dataForm}
        valorMaximo={valorMaximo}
      /> */}
    </div>
  );
};
export default Vigas;