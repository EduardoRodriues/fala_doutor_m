import { Route, Routes } from "react-router-dom";
import { Layout } from "../layout/layout";
import GestaoPlano from "../pages/gestao-planos/gestao-planos";
import GestaoPacientes from "../pages/gestao-pacientes/gestao-pacientes";
import RelatorioMedicos from "../pages/relatorios/relatorios-medicos/relatorio-medicos";
import RelatorioPlanos from "../pages/relatorios/relatorios-planos/relatorio-plano";
import RelatorioPacientes from "../pages/relatorios/relatorios-pacientes/relatorio-paciente";
import GestaoConsultas from "../pages/gestao-consultas/gestao-consultas";
import RelatorioConsultas from "../pages/relatorios/relatorios-consultas/relatorio-consulta";
import GestaoMedicos from "../pages/gestao-medicos/gestao-medicos";
import Chatbot from "../pages/chatbot/chatbot";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <GestaoMedicos />
          </Layout>
        }
      />
      <Route
        path="/pacientes"
        element={
          <Layout>
            <GestaoPacientes />
          </Layout>
        }
      />
      <Route
        path="/planos"
        element={
          <Layout>
            <GestaoPlano />
          </Layout>
        }
      />
      <Route
        path="/consultas"
        element={
          <Layout>
            <GestaoConsultas />
          </Layout>
        }
      />
      <Route
        path="/relatorio-medicos"
        element={
          <Layout>
            <RelatorioMedicos />
          </Layout>
        }
      />
      <Route
        path="/relatorio-pacientes"
        element={
          <Layout>
            <RelatorioPacientes />
          </Layout>
        }
      />
      <Route
        path="/relatorio-planos"
        element={
          <Layout>
            <RelatorioPlanos />
          </Layout>
        }
      />
      <Route
        path="/relatorio-consultas"
        element={
          <Layout>
            <RelatorioConsultas />
          </Layout>
        }
      />
      <Route
        path="/chatbot"
        element={
          <Layout>
            <Chatbot />
          </Layout>
        }
      />
    </Routes>
  );
}
