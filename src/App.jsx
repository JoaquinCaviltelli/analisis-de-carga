import { useEffect, useState } from "react";
import FormData from "./components/FormData";

function App() {  
  const [data, setData] = useState([]);
  const [zonas, setZonas]= useState([])

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
        console.log(data);
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
      fetchZonas()
    }, []);
  
  return (
    <>
      <h1 className="p-5 text-center text-2xl font-bold text-white bg-barbieriBlue">
        Analisis de carga (vigas)
      </h1>
      <FormData data={data } zonas={zonas}/>
    </>
  );
}

export default App;
