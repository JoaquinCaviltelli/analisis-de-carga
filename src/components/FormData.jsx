import { useEffect, useState } from "react";
const FormData = ({ data }) => {
  const [dataForm, setDataForm] = useState({
    kgCubierta: "35",
    kgEntrepiso: "0",
    kgSobrecarga: "96",
    luz: "",
    separacion: "s40",
  });
  const [kgTotales, setKgTotales] = useState("");
  const [posiblesPerfiles, setPosiblesPerfiles] = useState([])

  useEffect(() => {
    dataForm.kgEntrepiso > "0"
      ? (dataForm.kgSobrecarga = "200")
      : (dataForm.kgSobrecarga = "96");
  }, [dataForm.kgEntrepiso]);

  useEffect(() => {
    setKgTotales(
      parseInt(dataForm.kgSobrecarga) +
        parseInt(dataForm.kgCubierta) +
        parseInt(dataForm.kgEntrepiso)
    );
  }, [dataForm]);

    const calcularPerfil = () => {
        setPosiblesPerfiles([])
       const luzRounded = Math.ceil(dataForm.luz * 2) / 2;
      
      data.map((item) => {
         if (item.largo == luzRounded) {
            item.s40.map((perfil) => {
             if (
               perfil.resistencia > kgTotales/100 &&
               perfil.deformacion > kgTotales/100
             ) {
                 //posiblesPerfiles.push(perfil.perfil);
                setPosiblesPerfiles((prev) => ([
                     ...prev,
                     perfil
                 ]))
                }
            });
        }
    });
    
        
        
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    //console.log(dataForm);
    calcularPerfil();
  };
    const handelChange = (e) => {
      setPosiblesPerfiles([])
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <form
        className="m-10 grid w-4/12 grid-cols-3  items-center gap-2 text-gray-600"
        onSubmit={handelSubmit}
      >
        <label className="col-span-2">
          Tipo de cubierta <b>({dataForm.kgCubierta} kg/m2)</b>
        </label>
        <select
          className=" rounded border-2 border-gray-400 p-2 outline-none"
          name="kgCubierta"
          onChange={handelChange}
        >
          <option value="35">Chapa</option>
          <option value="80">Teja</option>
        </select>
        <label className="col-span-2">
          Entrepiso <b>({dataForm.kgEntrepiso} kg/m2)</b>
        </label>
        <select
          className=" rounded border-2 border-gray-400 p-2 outline-none"
          name="kgEntrepiso"
          onChange={handelChange}
        >
          <option value="0">No</option>
          <option value="40">Seco s/placa cementicia</option>
          <option value="80">Seco c/placa cementicia</option>
          <option value="100">Humedo</option>
        </select>

        <label className="col-span-2">
          Sobrecarga estandar <b>({dataForm.kgSobrecarga} kg/m2)</b>
        </label>
        <input
          className="rounded border-2 border-gray-400 p-2 outline-none"
          type="number"
          name="kgSobrecarga"
          onChange={handelChange}
          value={dataForm.kgSobrecarga}
        />

        <label className="col-span-2">Luz de apoyo</label>
        <input
          required
          step="0.01"
          className="rounded border-2 border-gray-400 p-2 outline-none"
          type="number"
          name="luz"
          onChange={handelChange}
        />
        <label className="col-span-2">Separacion entre perfiles: </label>
        <select
          className="rounded border-2 border-gray-400 p-2 outline-none"
          name="separacion"
          onChange={handelChange}
        >
          <option value="40">Cada 40cm</option>
          <option value="60">Cada 60cm</option>
        </select>

        <p className="col-span-full p-2 text-right">
          Total: <b>{kgTotales} kg/m2</b>
        </p>

        <button className="col-span-full rounded bg-teal-700 p-2 text-white">
          Calcular
        </button>
      </form>
          {
              posiblesPerfiles.length > 0 && <p className="max-w-md p-10">Para una luz de {dataForm.luz}m y una carga de {kgTotales}kg/m2 se necesita un perfil de <b>{posiblesPerfiles[0].perfil} mm</b> que tiene una deformacion de {posiblesPerfiles[0].deformacion} y una resistencia de {posiblesPerfiles[0].resistencia } segun la tabla del cirsoc para vigas</p>
      }
    </>
  );
};
export default FormData;
