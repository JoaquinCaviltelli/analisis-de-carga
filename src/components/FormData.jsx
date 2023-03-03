import Swal from "sweetalert2";

import { useEffect, useState } from "react";
const FormData = ({ data, zonas }) => {
  const [dataForm, setDataForm] = useState({
    kgCubierta: "35",
    kgEntrepiso: "0",
    kgSobrecarga: "96",
    kgTerminacion: "28",
    luz: "",
    separacion: "s40",
    ubicacion: "Cordoba",
    exposicion: "C",
  });
  const [kgTotales, setKgTotales] = useState("");
  const [cargaViento, setCargaViento] = useState({
    wp: "",
    ws: "",
  });
  const [exposicionViento, setExposicionViento] = useState({
    wp: "2.74",
    ws: "-8.72",
  });

  const [posiblesPerfiles, setPosiblesPerfiles] = useState([]);
  const [zonaActual, setZonaActual] = useState({
    nieve: "30",
    viento: "45",
  });
  const [valorMaximo, setValorMaximo] = useState("");

  useEffect(() => {
    dataForm.kgEntrepiso > "0"
      ? (dataForm.kgSobrecarga = "200")
      : (dataForm.kgSobrecarga = "96");
  }, [dataForm.kgEntrepiso]);

  useEffect(() => {
    zonas.map((zona) => {
      if (zona.zona == dataForm.ubicacion) {
        setZonaActual({
          nieve: zona.cargas.nieve,
          viento: zona.cargas.viento,
        });
      }
    });
    if (dataForm.exposicion === "C") {
      setExposicionViento({
        wp: "2.74",
        ws: "-8.72",
      });
    }
    if (dataForm.exposicion === "D") {
      setExposicionViento({
        wp: "3.27",
        ws: "-10.39",
      });
    }
  }, [dataForm]);

  useEffect(() => {
    setKgTotales(
      Math.round(
        parseInt(dataForm.kgSobrecarga) +
          parseInt(dataForm.kgCubierta) +
          parseInt(dataForm.kgEntrepiso) +
          parseInt(zonaActual.nieve)
      )
    );
    setCargaViento({
      wp: Math.round(
        ((parseInt(zonaActual.viento) * parseInt(zonaActual.viento)) / 100) *
          exposicionViento.wp +
          dataForm.kgCubierta
      ),
      ws: Math.round(
        ((parseInt(zonaActual.viento) * parseInt(zonaActual.viento)) / 100) *
          exposicionViento.ws +
          dataForm.kgCubierta
      ),
    });
    setValorMaximo(Math.max(kgTotales, cargaViento.wp, cargaViento.ws));
  }, [dataForm, zonaActual]);

  const calcularPerfil = () => {
    setPosiblesPerfiles([]);
    const luzRounded = Math.ceil(dataForm.luz * 2) / 2;

    data.map((item) => {
      if (item.largo == luzRounded) {
        item.s40.map((perfil) => {
          if (
            perfil.resistencia > valorMaximo / 100 &&
            perfil.deformacion > valorMaximo / 100
          ) {
            setPosiblesPerfiles((prev) => [...prev, perfil]);
          }
        });
      }
    });
  };

  const info = (title, text, img) => {
    Swal.fire({
      title: title,
      text: text,
      imageUrl: img,
      imageAlt: "Custom image",
      confirmButtonColor: "#022a3a",
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    calcularPerfil();
    console.log(dataForm);
    console.log(data);
  };
  const handelChange = (e) => {
    setPosiblesPerfiles([]);
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <form
        className="m-10 grid grid-cols-12  gap-2 text-gray md:w-6/12"
        onSubmit={handelSubmit}
      >
        <label className="col-span-8">
          Tipo de cubierta <b>({dataForm.kgCubierta} kg/m2) </b>
        </label>
        <select
          className=" col-span-4 rounded border border-gray p-2 outline-none"
          name="kgCubierta"
          onChange={handelChange}
        >
          <option value="35">Chapa</option>
          <option value="85">Teja</option>
          <option value="180">Cubierta plana</option>
        </select>

        <label className="col-span-8">
          Entrepiso <b>({dataForm.kgEntrepiso} kg/m2)</b>
        </label>
        <select
          className=" col-span-4 rounded border border-gray p-2 outline-none"
          name="kgEntrepiso"
          onChange={handelChange}
        >
          <option value="0">No</option>
          <option value="50">Seco s/placa cementicia</option>
          <option value="90">Seco c/placa cementicia</option>
          <option value="160">Humedo</option>
        </select>

        <label className="col-span-8">
          Sobrecarga <b>({dataForm.kgSobrecarga} kg/m2)</b>
          <span
            onClick={() =>
              info(
                "",
                "",
                "https://joaquincaviltelli.github.io/base-de-datos/sobrecarga.PNG"
              )
            }
            className="material-symbols-outlined cursor-pointer text-lg"
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
          value={dataForm.kgSobrecarga}
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
          <option value="40">Cada 40cm</option>
          <option value="60">Cada 60cm</option>
        </select>

        <p className="col-span-full p-2 text-right">
          Total: <b>{kgTotales} kg/m2</b>
        </p>
        <p className="col-span-full p-2 text-right">
          Carga de viento presion: <b>{cargaViento.wp} kg/m2</b>
        </p>
        <p className="col-span-full p-2 text-right">
          Carga de viento succion: <b>{cargaViento.ws} kg/m2</b>
        </p>

        <button className="col-span-full rounded bg-barbieriBlue p-2 text-white">
          Calcular
        </button>
      </form>
      {posiblesPerfiles.length > 0 && (
        <>
          <h2 className="mx-10 text-xl font-bold text-barbieriBlue md:w-6/12">
            {posiblesPerfiles[0].perfil}
          </h2>
          <p className="text-gray-600 mx-10 md:w-6/12">
            Para una luz de {dataForm.luz}m y una carga de {valorMaximo}kg/m2 se
            necesita un perfil de{" "}
            <b className="text-barbieriBlue">{posiblesPerfiles[0].perfil} mm</b>{" "}
            que tiene una deformacion de {posiblesPerfiles[0].deformacion} y una
            resistencia de {posiblesPerfiles[0].resistencia} segun la tabla del
            cirsoc para vigas
          </p>
        </>
      )}
    </>
  );
};
export default FormData;
