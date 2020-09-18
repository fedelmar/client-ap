import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';


const ExportarRegistro = ({registros, desde, hasta}) => {
    
    desde.setHours(0);
    hasta.setHours(0);

    let registrosExportados = registros.filter (registro => new Date(registro.fecha) >= desde && new Date(registro.fecha) <= hasta);

    const exportar = () => {
        const doc = new jsPDF()
        doc.autoTable({
            tableWidth: 'auto',
            margin: {top: 15, right: 5, bottom: 10, left: 5},
            styles: { fontSize: 8 },
            head: [
                ['Fecha',
                'Operario',
                'Lote',
                "Inicio",
                "Cierre",
                "Producto",
                "Caja", 
                "Esponjas",
                "Descarte",
                "Observaciones"]
            ],
            body: registrosExportados.map (i => [
                format(new Date(i.fecha), 'dd/MM/yy'),
                i.operario,
                i.lote,
                i.horaInicio,
                i.horaCierre,
                i.producto,
                i.caja,
                i.guardado,
                i.descarte,
                i.observaciones
            ]),
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(17)
                doc.setTextColor(40)
                doc.text('REGISTRO DE GUARDADO DE ESPONJAS', data.settings.margin.left + 35, 10)
          
                // Footer
                doc.setFontSize(10)
                var str = 'Pagina ' + doc.internal.getNumberOfPages()
        
                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                doc.text(str, data.settings.margin.left, pageHeight - 5)
            },
        })
           
        doc.save('registro.pdf')    
    }
    return (
        <button 
            className=" bg-green-700 p-1 ml-1 inline-block text-white rounded text-sm hover:bg-green-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
            onClick={() => exportar()}
        >
            Exportar!
        </button>
    );
}

export default ExportarRegistro;