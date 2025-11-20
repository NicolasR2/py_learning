import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cursos from "./pages/Cursos";
import "katex/dist/katex.min.css";
import DocenteDashboard from "./pages/DocenteDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CursoLoader from "./pages/CursoLoader";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/curso/:id" element={<CursoLoader />} />
      <Route path="/docente" element={<DocenteDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>
);
