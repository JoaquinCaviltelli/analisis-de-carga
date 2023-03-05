import { createBrowserRouter } from "react-router-dom";
import LayoutPublic from "../Layout/LayoutPublic";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

import Vigas from "../pages/Vigas";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublic/>,
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
        ],
      },
    ],
  },
]);
