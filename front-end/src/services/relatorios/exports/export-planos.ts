import axios from "axios";

export async function baixarExcelPlanos() {
  const response = await axios.get("http://localhost:3003/relatorios/planos/excel", {
    responseType: "arraybuffer",
  });

  const blob = new Blob([response.data as ArrayBuffer], { 
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Planos.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
