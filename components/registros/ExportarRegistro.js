import React from 'react';

const ExportarRegistro = ({registros, desde, hasta}) => {
    
    desde.setHours(0);
    hasta.setHours(0);

    const registrosExportados = registros.filter (registro => new Date(registro.fecha) >= desde && new Date(registro.fecha) <= hasta);
    console.log(registrosExportados);

    return (
        <button className=" bg-green-700 p-1 ml-1 inline-block text-white rounded text-sm hover:bg-green-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">Exportar!</button>
    );
}

export default ExportarRegistro;