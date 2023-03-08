import Swal from "sweetalert2";
import tabla from "../tabla.json";
import zonas from "../zonas.json";
import { Toast } from "../components/Toast";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imgPerfil from "/public/perfil.png";
import imgLuzDeApoyo from "/public/luz-de-apoyo.png";
import imgSobrecarga from "/public/sobrecarga.png";
import imgViento from "/public/viento.png";

const Vigas = () => {
  //datos del formulario
  const [dataForm, setDataForm] = useState({
    kgCubierta: 35,
    kgEntrepiso: 0,
    kgSobrecarga: 96,
    luz: 0,
    separacion: 40,
    ubicacion: "Seleccionar",
    exposicion: "C",
    margen: 1,
  });

  var {
    kgCubierta,
    margen,
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
        (Number(kgSobrecarga) +
          Number(kgCubierta) +
          Number(kgEntrepiso) +
          Number(zonaActual.nieve)) *
          margen
      )
    );
  }, [kgSobrecarga, kgCubierta, kgEntrepiso, zonaActual.nieve, margen]);

  useEffect(() => {
    setValorMaximo(Math.max(kgTotales, cargaViento.wp, cargaViento.ws));
  }, [kgTotales, cargaViento]);

  const calcularPerfil = () => {
    setPosiblesPerfiles([]);

    //se redonde hacia arriba la luz de apoyo para que sea igual al de la tabla
    var luzRounded = luz < 2.5 ? 2.5 : Math.ceil(luz * 2) / 2;

    if (luz > 9) {
      return Toast.fire({
        icon: "error",
        title: "El largo maximo que verifica la tabla es de 9m",
      });
    }

    tabla.map((item) => {
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

    if(posiblesPerfiles !== []){
      Toast.fire({
        icon: "error",
        title: `Se ha superado los kg en una luz de ${luz}m`,
      });
    }
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

  useEffect(() => {
    if (posiblesPerfiles.length > 0) {
      Swal.fire({
        title: `${posiblesPerfiles[0].perfil} mm`,
        text: `Para una luz de ${dataForm.luz}m y una carga de ${valorMaximo}kg/m2 se
            necesita un perfil de ${posiblesPerfiles[0].perfil} mm
            que tiene una deformacion de ${posiblesPerfiles[0].deformacion} y una
            resistencia de ${posiblesPerfiles[0].resistencia} segun la tabla del
            cirsoc para vigas.`,
        footer: `Los perfiles que verifican son: ${posiblesPerfiles.map((p) => {
          return ` ${p.perfil} `
        })}`,
        showCloseButton: true,
        imageUrl: imgPerfil,
        imageHeight: 200,
        imageAlt: "Custom image",
        showConfirmButton: false,
      })
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
    <div className="my-10 mx-10 max-w-5xl text-gray lg:mx-48">
      <h2 className="border-b border-ligthGray pb-4 text-3xl font-black text-barbieriBlue">
        Analisis de cargas (vigas)
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
          <span
            onClick={() => info("", "", imgSobrecarga)}
            className="material-symbols-outlined cursor-pointer text-lg leading-none "
          >
            info
          </span>
        </label>
        <input
          min="0"
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          type="number"
          name="kgSobrecarga"
          onChange={handelChange}
          value={kgSobrecarga}
        />
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
          <b> Exposicion del viento </b>
          (Wp: {exposicionViento.wp} Ws: {exposicionViento.ws})
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
          <b> Luz de apoyo</b>
          <span
            onClick={() =>
              info(
                "Luz de apoyo",
                "En este caso la distancia total es de 8m, pero la luz de apoyo es de 5m ya que hay una viga que divide las luces",
                imgLuzDeApoyo
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
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          type="number"
          name="luz"
          onChange={handelChange}
        />
        <label className="col-span-8">
          <b>Separacion entre perfiles:</b>{" "}
        </label>
        <select
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          name="separacion"
          onChange={handelChange}
        >
          <option value={40}>Cada 40cm</option>
          <option value={60}>Cada 60cm</option>
        </select>
        <label className="col-span-8">
          <b>Margen de calculo</b>
        </label>
        <select
          className="col-span-4 h-full rounded border border-gray p-2 outline-none"
          name="margen"
          onChange={handelChange}
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
          <p>
            <b>Carga de viento presion</b> (D+Wp): {cargaViento.wp} kg/m2
          </p>
          <p>
            <b>Carga de viento succion</b> (D-Ws): {cargaViento.ws} kg/m2
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
export default Vigas;
