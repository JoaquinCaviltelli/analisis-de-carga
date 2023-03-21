import { createContext, useContext, useState } from "react";

export const DatosContext = createContext();

const DatosProvider = ({ children }) => {

    const [datos, setDatos] = useState({
        kgCarga: "",
        largo: "",
      })
  return <DatosContext.Provider value={{datos, setDatos}} >{children}</DatosContext.Provider>;
};

export default DatosProvider;

export const useDatosContext = ()=> useContext(DatosContext)