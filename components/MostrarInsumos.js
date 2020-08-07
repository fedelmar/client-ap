/* eslint-disable react/prop-types */
import React, {useState} from 'react';

const MostrarInsumos = ({arrInsumos, insumos}) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }
    const handleClose = () => {
        setIsOpen(false);
    }

    const nuevoArreglo = 
        insumos.map( insumoProducto => (
            arrInsumos.filter(insumo => 
                (insumoProducto === insumo.id ? 
                    (<th className="border px-4 py-2" >{insumoProducto.nombre}</th>)
                    : null)
                )
            )
        )
    console.log(nuevoArreglo)
    console.log(isOpen)

    return(
        <th className=" border px-4 py-2" >
            <button
                useRef={isOpen}
                className="font-bold border-1 rounded p-1 shadow"
                onClick={() => {
                    !isOpen
                      ? handleOpen()
                      : handleClose();
                  }}
            >
                {isOpen ? "Cerrar" : "Mostrar"}
            </button>
            <div useRef={isOpen} className={(isOpen ? "block " : "hidden ") + "absolute mt-2 py-2 bg-gray-200 rounded shadow"}>
                {insumos.map( insumoProducto => (
                    arrInsumos.filter(insumo => 
                        (insumoProducto === insumo.id ? 
                            (insumoProducto.nombre)
                            : null)
                        )
                    )
                )}
                <p className="font-light p-1">Insumo 2</p>
                <p className="font-light p-1">Insumo 3</p>
            </div>
            
        </th>
        
    );
}

export default MostrarInsumos;
