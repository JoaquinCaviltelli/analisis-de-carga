import { useEffect, useState } from "react";
import FormData from "./components/FormData";

function App() {  
  const [data, setData] = useState([]);

    const fetchData = async () => {
      try {
        const response = await fetch(
          "src/tabla.json"
        );
        if (!response.ok) {
          throw "Error al conectar la API";
        }
        const data = await response.json();
        setData(data);
        console.log(data)
      } catch (error) {
        console.log(error);
        setData([]);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);
  
  return (
    <>
      <h1 className="m-10 text-3xl font-bold text-teal-700">
        Analisis de carga (viga tubo)
      </h1>
      <FormData data={data } />
    </>
  );
}

export default App;
