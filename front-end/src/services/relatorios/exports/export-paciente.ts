import axios from "axios";

export async function baixarExcelPacientes50() {
  const response = await axios.get("http://localhost:3003/relatorios/pacientes/excel", {
    responseType: "arraybuffer",
  });

  const blob = new Blob([response.data as ArrayBuffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "PacientesAcima50.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function baixarExcelPacientesPlano() {
  const response = await axios.get("http://localhost:3003/relatorios/pacientes/excel/planos", {
    responseType: "arraybuffer",
  });

  const blob = new Blob([response.data as ArrayBuffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "PacientesPorPlano.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
