import React, {useState} from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';


const NUEVA_SALIDA = gql `
    mutation nuevoRegistroSalida($input: SalidaInput){
        nuevoRegistroSalida(input: $input){
            id
            fecha
            cliente
            remito
            lotes {
                lote
                cantidad
            }
        }
    }
`;

const LISTA_REGISTROS = gql `
    query obtenerRegistrosSalidas{
        obtenerRegistrosSalidas{
            id
            fecha
            cliente
            remito
            lotes {
                lote
                cantidad
            }
        }
    }
`;

const FinalizarSalida = (datos) => {

    const router = useRouter();
    const { cliente, productos, remito } = datos;
    const [mensaje, guardarMensaje] = useState(null);
    const [ nuevoRegistroSalida ] = useMutation(NUEVA_SALIDA, {
        update(cache, {data: { nuevoRegistroSalida }}) {
            const { obtenerRegistrosSalidas } = cache.readQuery({ query: LISTA_REGISTROS });

            cache.writeQuery({
                query: LISTA_REGISTROS,
                data: {
                    obtenerRegistrosSalidas: [...obtenerRegistrosSalidas, nuevoRegistroSalida ]
                }
            })
        }
    });

    const schema = Yup.object().shape({
        friends: Yup.array()     
          .of(     
            Yup.object().shape({
                id: Yup.string()
                    .required('Required'),
                lote: Yup.string()         
                    .required('Required'),
                producto: Yup.string()
                    .required('Required'),
                disponible: Yup.number(),
                cantidad: Yup.number()
            })     
          )
    });

    const handleSubmit = async (valores) => {
        const { lotes } = valores;
        console.log('Remito: ', remito)
        console.log('Cliente: ', cliente.id)
        console.log('lotes: ',lotes)
        const lotesAGuardar = []
        lotes.forEach(index => {
            lotesAGuardar.push({
                lote: index.id,
                cantidad: index.cantidad
            })
        });

        console.log(lotesAGuardar);

        try {
            const { data } = await nuevoRegistroSalida({
                variables: {
                    input: {
                        cliente: cliente.id,
                        remito: remito,
                        lotes: lotesAGuardar
                    }
                }                
            });

            router.push('/registros/salidas');
        } catch (error) {
            guardarMensaje(error.message.replace('GraphQL error: ', ''));
        }
    }

    // Mostrar mensaje de base de datos si hubo un error
    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return(
        <div>
            {mensaje && mostrarMensaje()}

            <div className="flex">
                <p className="block text-gray-700 text-m font-bold mb-2 pr-2">Cliente:</p>
                <p className="block text-gray-700 text-m mb-2">{cliente.empresa}</p>
            </div>
            <div className="flex">
                <p className="block text-gray-700 text-m font-bold mb-2 pr-2">Remito:</p>
                <p className="block text-gray-700 text-m mb-2">{remito}</p>
            </div>
            <p className="block text-gray-700 text-m font-bold mb-2">Seleccione las cantidades</p>
            <Formik
                initialValues={{ lotes: productos }}
                onSubmit={values => handleSubmit(values)}
                validationSchema={schema}
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
                                                    cantidad: parseInt(event.target.value),
                                                    id: lote.id
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
    );
}

export default FinalizarSalida;