import React from 'react';
import { exportar } from '../../servicios/exportarDatos';

const ExportarPDF = ({regs, modelo}) => {

    return (              
        <button 
            className="bg-green-700 p-1 ml-1 inline-block text-white rounded text-sm hover:bg-green-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
            onClick={() => exportar(regs, modelo)}
        >
            Exportar!
        </button>  
    );
}

export default ExportarPDF;
