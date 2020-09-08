import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';

const FinalizarSalida = (datos) => {

    const {cliente, productos} = datos;
    console.log(cliente)
    console.log(productos)
    return(
        <>
            <div>
                <div className="flex">
                    <p className="block text-gray-700 text-m font-bold mb-2 pr-2">Cliente:</p>
                    <p className="block text-gray-700 text-m mb-2">{cliente.empresa}</p>
                </div>
                <p className="block text-gray-700 text-m font-bold mb-2">Seleccione las cantidades</p>
                <Formik
                    initialValues={{ lotes: productos }}
                    onSubmit={values =>
                        setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        }, 500)
                    }
                    render={({ values }) => (
                        <Form>
                            <FieldArray
                                name="lotes"
                                render={arrayHelpers => (
                                <div>
                                    {values.lotes && values.lotes.length > 0 ? (
                                        values.lotes.map((lote, index) => (
                                            <div key={index}>
                                                <div className="flex">
                                                    <p className="text-gray-800 text-m font-light p-2">Lote: {lote.lote}</p>
                                                    <p className="text-gray-800 text-m font-light p-2">Producto: {lote.producto}</p> 
                                                    <p className="text-gray-800 text-m font-light p-2">Disponibles: {lote.disponible}</p>                                            
                                                </div>
                                                <input
                                                    onChange={() => arrayHelpers.replace(index, {
                                                        lote: lote.lote,
                                                        producto: lote.producto,
                                                        disponible: lote.disponible,
                                                        cantidad: event.target.value
                                                    })}
                                                    type="number"
                                                    id="cantidad"
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                        ))
                                    ) : null}
                                    <div>
                                        <button className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" type="submit">Finalizar Registro</button>
                                    </div>
                                </div>
                                )}
                            />
                        </Form>
                    )}
                />
            </div>


            {/*productos.map(i => (
                <div>
                    <div className="flex">
                        <p className="text-gray-800 font-light p-2">Lote: {i.lote}</p>
                        <p className="text-gray-800 font-light p-2">Producto: {i.producto}</p> 
                        <p className="text-gray-800 font-light p-2">Disponibles: {i.disponible}</p>
                    </div>                    
                    <input
                        type="number"
                        id="cantidad"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        
                    />
                </div>
            ))*/}
        </>
    );
}

export default FinalizarSalida;