import Swal from "sweetalert2";
import { Toast } from "../components/Toast";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDatosContext } from "../context/DatosContext";

import vigasTubo from "../database/vigasTubo.json";
import zonas from "../database/zonas.json";

import imgPerfil from "../assets/viga-tubo.png";
import imgLuzDeApoyo from "/src/assets/luz-de-apoyo-tubo.png";
import imgAinf from "/src/assets/viga-ainf.png";

import BtnBack from "../components/BtnBack";
import BtnSubmit from "../components/BtnSubmit";
import TextFooter from "../components/TextFooter";

const VigasTubo = () => {
  //datos del formulario
  const [dataForm, setDataForm] = useState({
    kgCubierta: 35,
    kgEntrepiso: 0,
    kgSobrecarga: 96,
    luz: 0,
    ubicacion: "Seleccionar",
    margen: 1.1,
    aInf: 1,
  });
  var { kgCubierta, margen, aInf, kgEntrepiso, kgSobrecarga, luz, ubicacion } =
    dataForm;

  const { datos, setDatos } = useDatosContext();

  const navigate = useNavigate();

  const calcularColumna = () => {
    setDatos({
      kgCarga: kgTotales,
      largo: dataForm.luz,
    });

    // navigate("/tipo-de-analisis/columnas");
  };

  // suma los kg de la cubierta, entrepiso, sobregarga y nieve
  const [kgTotales, setKgTotales] = useState(0);

  //cargas de viento y nieve segun la zona (por defecto Cordoba)
  const [zonaActual, setZonaActual] = useState({
    nieve: 0,
    viento: 0,
  });

  useEffect(() => {
    //se modifica la sobrecarga si existe entrepiso
    Number(kgEntrepiso) > 0
      ? (dataForm.kgSobrecarga = 200)
      : (dataForm.kgSobrecarga = 96);
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
  }, [ubicacion]);

  useEffect(() => {
    //se suma los kg de la cubierta, entrepiso, sobregarga y nieve
    setKgTotales(
      Math.round(
        (Number(kgSobrecarga) +
          Number(kgCubierta) +
          Number(kgEntrepiso) +
          Number(zonaActual.nieve)) *
          aInf *
          margen
      )
    );
  }, [kgSobrecarga, kgCubierta, kgEntrepiso, zonaActual.nieve, margen, aInf]);

  const calcularPerfil = () => {
    //se redonde hacia arriba la luz de apoyo para que sea igual al de la tabla
    var luzRounded = luz < 1.5 ? 1.5 : Math.ceil(luz * 2) / 2;
    var kgRounded = kgTotales <= 100 ? 200 : Math.ceil(kgTotales / 100) * 100;

    if (luz > 7) {
      return Toast.fire({
        icon: "error",
        title: "El largo maximo que verifica la tabla es de 7m",
      });
    }

    vigasTubo.map((item) => {
      if (item.largo == luzRounded) {
        item.carga.map((carga) => {
          if (carga.q === kgRounded) {
            Swal.fire({
              title: `Viga Tubo: ${carga.perfil}`,
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
              title: `Se ha superado los kg en una luz de ${luz}m`,
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
      text: text,
      imageUrl: img,
      imageAlt: "Custom image",
      showConfirmButton: false,
      showCloseButton: true,
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    calcularPerfil();
    calcularColumna();
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
        Analisis de cargas (vigas tubo y dinteles)
      </h2>
      <form
        className="mt-10 grid w-full max-w-2xl grid-cols-12  items-center gap-x-5 gap-y-1 text-sm "
        onSubmit={handelSubmit}
      >
        <label className="col-span-8">
          <b>Tipo de cubierta </b>({kgCubierta} kg/m2)
        </label>
        <select
          className=" col-span-4 h-full rounded border border-gray p-2 outline-none"
          name="kgCubierta"
          onChange={handelChange}
        >
          <option value={35}>Chapa</option>
          <option value={85}>Teja</option>
          <option value={180}>Cubierta plana</option>
          <option value={0}>No</option>
        </select>

        <label className="col-span-8">
          <b> Entrepiso </b>({kgEntrepiso} kg/m2)
        </label>
        <select
          className=" col-span-4 h-full rounded border border-gray p-2 outline-none"
          name="kgEntrepiso"
          onChange={handelChange}
        >
          <option value={0}>No</option>
          <option value={50}>Seco s/placa cementicia</option>
          <option value={90}>Seco c/placa cementicia</option>
          <option value={160}>Humedo</option>
        </select>

        <label className="col-span-8">
          <b> Sobrecarga </b>({kgSobrecarga} kg/m2)
        </label>
        <select
          onChange={handelChange}
          name="kgSobrecarga"
          className=" col-span-4 h-full rounded border border-gray p-2 outline-none"
        >
          {kgEntrepiso <= 0 ? (
            <>
              <option value="96">Cubierta inclinada</option>
              <option value="100">Cubierta plana no transitada</option>
            </>
          ) : (
            <>
              <option value="200">Vivienda</option>
              <option value="500">Balcon voladizo</option>
              <option value="300">Azotea transitable</option>
              <option value="250">Oficinas</option>
              <option value="500">Sala de reuniones</option>
              <option value="500">Comedores, restaurantes</option>
            </>
          )}
        </select>
        <label className="col-span-8">
          <b>Ubicacion </b>
          (Nieve:{zonaActual.nieve} kg/m2 - Viento {zonaActual.viento} v/ms)
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
          <b> Luz de apoyo</b>
          <span
            onClick={() => info("Luz de apoyo", "", imgLuzDeApoyo)}
            className="material-symbols-outlined cursor-pointer text-lg leading-none"
          >
            info
          </span>
        </label>
        <input
          autoComplete="off"
          required
          step="0.01"
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          type="number"
          name="luz"
          onChange={handelChange}
        />

        <label className="col-span-8">
          <b> Ancho de influencia</b>
          <span
            onClick={() =>
              info(
                "Ancho de influencia",
                "Es el largo de la viga dividido dos",
                imgAinf
              )
            }
            className="material-symbols-outlined cursor-pointer text-lg leading-none"
          >
            info
          </span>
        </label>
        <input
          defaultValue={1}
          autoComplete="off"
          required
          step="0.01"
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          type="number"
          name="aInf"
          onChange={handelChange}
        />

        <label className="col-span-8">
          <b>Margen de calculo</b>
        </label>
        <select
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          name="margen"
          onChange={handelChange}
          defaultValue={1.1}
        >
          <option value={1}>0%</option>
          <option value={1.05}>5%</option>
          <option value={1.1}>10%</option>
          <option value={1.15}>15%</option>
          <option value={1.2}>20%</option>
        </select>

        <div className="col-span-full p-2 text-right">
          <p>
            <b>Carga vertical</b> (D+Lr+S): {kgTotales} kg/m2
          </p>
        </div>

        <BtnBack />
        <BtnSubmit />
      </form>
      <TextFooter />
    </div>
  );
};
export default VigasTubo;
