import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CREAR_LOTE = gql`
    mutation nuevoProductoStock($input: sProductoInput){
        nuevoProductoStock(input: $input){
            id
            lote
            producto        
            estado
            cantidad
        }
    }
`;

const ACTUALIZAR_INSUMO = gql `
    mutation actualizarInsumoStock($id: ID!, $input: sInsumoInput){
        actualizarInsumoStock(id: $id, input: $input) {
            id
            lote
            insumo
            cantidad
        }
    }
`;

const OBTENER_STOCK = gql`
    query obtenerProductosStock{
        obtenerProductosStock{
            id
            lote
            cantidad
            producto
            estado
        }
    }
`;

const ManejoDeStock = ({registro, cantidades}) => {
    //console.log('Registro en Manejo de Stock : ',registro)

    useQuery(OBTENER_STOCK);
    const [ actualizarInsumoStock ] = useMutation(ACTUALIZAR_INSUMO);
    const [ nuevoProductoStock ] = useMutation(CREAR_LOTE, {
        update(cache, {data: { nuevoProductoStock }}) {
            const { obtenerProductosStock } = cache.readQuery({ query: OBTENER_STOCK});

            if (!obtenerProductosStock.some(i => i.id === nuevoProductoStock.id)) {
                cache.writeQuery({
                    query: OBTENER_STOCK,
                    data: {
                        obtenerProductosStock: [...obtenerProductosStock, nuevoProductoStock]
                    }
                })
            }           
        }
    });

    let menor;
    registro.bolsaDisp <= registro.esponjaDisp ? menor = registro.bolsaDisp : menor = registro.esponjaDisp;

    const formik = useFormik({
        initialValues: {
            esponjas: 0,
        },
        validationSchema: Yup.object({
            esponjas: Yup.number()
                                .max(menor, `Debe ser menor o igual a ${menor}`)
                                .required('Ingrese la cantidad producida')
        }),
        onSubmit: valores => {       
            actualizarStock(valores);            
        }
    });

    const actualizarStock = async valores => {
        cantidades(valores);
        try {
            const { data: dataBolsa } = await actualizarInsumoStock({
                variables: {
                    id: registro.lBolsaID,
                    input: {
                        lote: registro.lbolsa,
                        cantidad: registro.bolsaDisp - valores.esponjas
                    }
                }
            })
            const { data: dataEsponja } = await actualizarInsumoStock({
                variables: {
                    id: registro.lEsponjaID,
                    input: {
                        lote: registro.lEsponja,
                        cantidad: registro.esponjaDisp - valores.esponjas
                    }
                }
            })
            const { data: dataLote } = await nuevoProductoStock({
                variables: {
                    input: {
                        lote: registro.lote,
                        producto: registro.productoID,
                        estado: "Proceso",
                        cantidad: valores.esponjas
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form
            className="bg-white shadow-md px-8 pt-4 pb-8 mb-2"
            onSubmit={formik.handleSubmit}
        >
            <h1 className="block text-gray-700 font-bold mb-2 text-center text-2xl">Sumar al Stock</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="esponjas">
                    Esponjas
                </label>

                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="esponjas"
                    type="number"
                    placeholder="Ingrese la cantidad producida..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.esponjas}
                />
            </div>

            { formik.touched.esponjas && formik.errors.esponjas ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.esponjas}</p>
                </div>
            ) : null  }

            <input
                type="submit"
                className="bg-green-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-green-900"
                value="Sumar"
            />
            
        </form>
    );
}

export default ManejoDeStock;
