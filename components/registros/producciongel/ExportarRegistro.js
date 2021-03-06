import React, { useState }  from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import DayPickerInput from 'react-day-picker/DayPickerInput';


const ExportarRegistro = ({registros}) => {

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    let registrosExportados; 
    if (startDate && endDate) {
        startDate.setHours(0);
        endDate.setHours(0);
        registrosExportados = registros.filter (registro => new Date(registro.creado) >= startDate && new Date(registro.creado) <= endDate);
    }
    
    const exportar = () => {
        const doc = new jsPDF()
        doc.autoTable({
            tableWidth: 'auto',
            margin: {top: 15, right: 5, bottom: 10, left: 5},
            styles: { fontSize: 8 },
            head: [
                ['Fecha',
                'Lote',
                "Inicio",
                "Cierre",
                "Operario",
                "Cliente",
                "Bolsa",
                "Gel",
                "DB",
                "M",
                "Produccion",
                "Descarte",
                "Puesto 1",
                "Puesto 2",
                "Observaciones"]
            ],
            body: registrosExportados.map (i => [
                format(new Date(i.creado), 'dd/MM/yy'),
                i.lote,
                format(new Date(i.creado), 'HH:mm'),
                format(new Date(i.modificado), 'HH:mm'),
                i.operario,
                i.cliente,
                i.loteBolsa,
                i.loteGel,
                i.dobleBolsa === true ? "SI" : "NO",
                i.manta === true ? "SI" : "NO",
                i.cantProducida,
                i.cantDescarte,
                i.puesto1,
                i.puesto2,
                i.observaciones
            ]),
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(17)
                doc.setTextColor(40)
                doc.text('REGISTRO DE PRODUCCION DE BOLSAS DE GEL', data.settings.margin.left + 35, 10)
          
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
        <div className="flex flex-row justify-center">
            <p className="block text-gray-70 font-bold mr-1 mt-1">Seleccione el periodo a exportar: </p>
            <div className="m-1">
                <DayPickerInput
                value=" Desde... "
                onDayChange={day => setStartDate(day)}
                />
            </div>
            <div className="m-1">
                <DayPickerInput
                value=" Hasta... "
                onDayChange={day => setEndDate(day)}
                />
            </div>
            {startDate && endDate ?
                <button 
                    className=" bg-green-700 p-1 ml-1 inline-block text-white rounded text-sm hover:bg-green-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
                    onClick={() => exportar()}
                >
                    Exportar!
                </button>
            : null}


        </div>
    );
}

export default ExportarRegistro;