import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";

// Importação das Páginas
import Dashboard from "./pages/Dashboard";
import Territorios from "./pages/Territorios";
import Comunidades from "./pages/Comunidades";
import CartasAbertas from "./pages/CartasAbertas";
import Biblioteca from "./pages/Biblioteca";
import Narrativas from "./pages/Narrativas";
import Integracao from "./pages/Integracao";

// Componente temporário para Login (Onboarding)
const Onboarding = () => (
  <div className="flex items-center justify-center h-screen bg-orange-50 text-amber-900">
    <h1>Login / Onboarding (Em construção)</h1>
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/territorios" element={<Territorios />} />
          <Route path="/comunidades" element={<Comunidades />} />
          <Route path="/cartas" element={<CartasAbertas />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/narrativas" element={<Narrativas />} />
          <Route path="/integracao" element={<Integracao />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </Layout>
    </Router>
  );
}