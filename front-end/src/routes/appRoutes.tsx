import { Route, Routes } from "react-router-dom";
import { Layout } from "../layout/layout";
import GestaoMedico from "../pages/gestao-medicos/gestao-medicos";
import GestaoPlano from "../pages/gestao-planos/gestao-planos";
import GestaoPacientes from "../pages/gestao-pacientes/gestao-pacientes";
import RelatorioMedicos from "../pages/relatorios/relatorios-medicos/relatorio-medicos";
import RelatorioPlanos from "../pages/relatorios/relatorios-planos/relatorio-plano";
import RelatorioPacientes from "../pages/relatorios/relatorios-pacientes/relatorio-paciente";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <GestaoMedico />
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
    </Routes>
  );
}
