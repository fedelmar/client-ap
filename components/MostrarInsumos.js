/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';

const MostrarInsumos = ({arrInsumos, insumos}) => {

    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        const handleEsc = (event) => {
        if (event.keyCode === 27) {
            setIsOpen(false)
        }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
        window.removeEventListener('keydown', handleEsc);
        };
    }, []);


    const handleOpenClose = () => {
        setIsOpen(!isOpen);
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const a = arrInsumos.filter(({id}) => insumos.includes(id))
                .map(({nombre, categoria})=> (<p key={arrInsumos.id} className="px-2 py-2" >{`${nombre} Material: ${categoria}`} </p>))

    return(
        <th className="border px-4 py-2" >
            <button
                useref={isOpen.toString()}
                className="font-bold border-1 rounded p-1 shadow"
                onClick={() => { handleOpenClose() }}
            >
                Mostrar
            </button>
            <button 
                useref={isOpen.toString()}
                onClick={handleClose}
                tabIndex="-1" 
                className={(isOpen ? "block " : "hidden ") + "fixed inset-0 bg-black opacity-25 h-full w-full cursor-default"}
            />
            <div useref={isOpen.toString()} className={(isOpen ? "block " : "hidden ") + "absolute mt-2 py-2 bg-white rounded shadow"}>
                {a.length === 0 ? (<p className="px-2 py-2" >No hay insumos para mostrar</p>) : a}
            </div>            
        </th>
        
    );
}

export default MostrarInsumos;
