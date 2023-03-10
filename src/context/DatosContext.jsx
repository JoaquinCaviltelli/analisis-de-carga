import { createContext, useContext, useState } from "react";

export const DatosContext = createContext({
  kgCarga: 50,
  luz: 3.5,
});

const DatosProvider = ({ children }) => {

    const [datos, setDatos] = useState({
        kgCarga: 0,
        aInf: 1,
      })
  return <DatosContext.Provider value={{datos, setDatos}} >{children}</DatosContext.Provider>;
};

export default DatosProvider;

export const useDatosContext = ()=> useContext(DatosContext)