import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import DatosProvider from "./context/DatosContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DatosProvider>
      <RouterProvider router={router} />
    </DatosProvider>
  </React.StrictMode>
);
