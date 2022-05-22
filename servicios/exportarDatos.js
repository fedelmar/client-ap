import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  GUARDADO_ESPONJAS,
  PRODUCCION_ESPONJAS,
  PRODUCCION_PLACAS,
  SELLADO_PLACAS,
  GUARDADO_PLACAS,
  PRODUCCION_GEL,
  PREPARACION_GEL,
  INGRESOS,
  SALIDAS,
} from "../constants/constants";

const exportar = (datos, modelo) => {
  let modelFormat;
  switch (modelo) {
    case "PRODUCCION_ESPONJAS":
      modelFormat = PRODUCCION_ESPONJAS.export;
      break;
    case "GUARDADO_ESPONJAS":
      modelFormat = GUARDADO_ESPONJAS.export;
      break;
    case "PRODUCCION_PLACAS":
      modelFormat = PRODUCCION_PLACAS.export;
      break;
    case "SELLADO_PLACAS":
      modelFormat = SELLADO_PLACAS.export;
      break;
    case "GUARDADO_PLACAS":
      modelFormat = GUARDADO_PLACAS.export;
      break;
    case "PRODUCCION_GEL":
      modelFormat = PRODUCCION_GEL.export;
      break;
    case "PREPARACION_GEL":
      modelFormat = PREPARACION_GEL.export;
    case "INGRESOS":
      modelFormat = INGRESOS.export;
    case "SALIDAS":
      modelFormat = SALIDAS.export;
    default:
      break;
  }

  const { head, regFormat, title, fileName } = modelFormat;

  const body = datos.map((registro) => regFormat(registro));

  const doc = new jsPDF();
  doc.autoTable({
    tableWidth: "auto",
    margin: { top: 15, right: 5, bottom: 10, left: 5 },
    styles: { fontSize: 7 },
    head,
    body,
    didDrawPage: function (data) {
      // Header
      doc.setFontSize(17);
      doc.setTextColor(40);
      doc.text(title, data.settings.margin.left + 35, 10);

      // Footer
      doc.setFontSize(10);
      var str = "Pagina " + doc.internal.getNumberOfPages();

      var pageSize = doc.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 5);
    },
  });

  doc.save(fileName);
};

export { exportar };
