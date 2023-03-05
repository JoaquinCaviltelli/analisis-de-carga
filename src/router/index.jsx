import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import LayoutPublic from "../layout/LayoutPublic";
import Vigas from "../pages/Vigas";

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
        ],
      },
    ],
  },
]);
