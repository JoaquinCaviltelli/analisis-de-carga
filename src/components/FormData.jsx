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
  });
  const [kgTotales, setKgTotales] = useState("");
  const [posiblesPerfiles, setPosiblesPerfiles] = useState([]);
  const [zonaActual, setZonaActual] = useState({
    nieve: "30",
    viento: "20",
  });

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
  }, [dataForm.ubicacion]);

  useEffect(() => {
    setKgTotales(
      parseInt(dataForm.kgSobrecarga) +
        parseInt(dataForm.kgCubierta) +
        parseInt(dataForm.kgEntrepiso) +
        parseInt(zonaActual.nieve)
    );
  }, [dataForm, zonaActual]);

  const calcularPerfil = () => {
    setPosiblesPerfiles([]);
    const luzRounded = Math.ceil(dataForm.luz * 2) / 2;

    data.map((item) => {
      if (item.largo == luzRounded) {
        item.s40.map((perfil) => {
          if (
            perfil.resistencia > kgTotales / 100 &&
            perfil.deformacion > kgTotales / 100
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
          Sobrecarga estandar <b>({dataForm.kgSobrecarga} kg/m2)</b>
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
            Para una luz de {dataForm.luz}m y una carga de {kgTotales}kg/m2 se
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
