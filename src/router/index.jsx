import { createBrowserRouter } from "react-router-dom";
import LayoutPublic from "../Layout/LayoutPublic";
import Home from "../pages/Home";
import Montantes from "../pages/Montantes";
import NotFound from "../pages/NotFound";

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
            path: "/vigas",
            element: <Vigas />,
          },
          {
            path: "/vigas-tubo",
            element: <VigasTubo />,
          },
          {
            path: "/montantes",
            element: <Montantes />,
          },
        ],
      },
    ],
  },
]);
