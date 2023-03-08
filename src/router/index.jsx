import { createBrowserRouter } from "react-router-dom";
import LayoutPublic from "../Layout/LayoutPublic";
import Columnas from "../pages/Columnas";
import Home from "../pages/Home";
import Montantes from "../pages/Montantes";
import NotFound from "../pages/NotFound";
import TipoDeAnalisis from "../pages/TipoDeAnalisis";

import Vigas from "../pages/Vigas";
import VigasTubo from "../pages/VigasTubo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublic />,
    errorElement: <NotFound />,
    children: [
      {
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "/tipo-de-analisis",
            element: <TipoDeAnalisis />,
          },
          {
            path: "/tipo-de-analisis/vigas",
            element: <Vigas />,
          },
          {
            path: "/tipo-de-analisis/vigas-tubo",
            element: <VigasTubo />,
          },
          {
            path: "/tipo-de-analisis/columnas",
            element: <Columnas />,
          },
          {
            path: "/tipo-de-analisis/montantes",
            element: <Montantes />,
          },
        ],
      },
    ],
  },
]);
