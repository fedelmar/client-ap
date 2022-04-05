import { gql } from '@apollo/client';

const OBTENER_REGISTROS = gql`
    query obtenerRegistrosCPG($page: Int){
        obtenerRegistrosCPG(page: $page){
            id
            creado
            modificado
            operario
            producto
            lote
            cliente
            loteBolsa
            loteBolsaID
            loteBolsaCristal
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantDescarteBolsaCristal
            cantProducida
            puesto1
            puesto2
            observaciones
            estado
        }
    }
`;

const OBTENER_REGISTROS_ABIERTOS = gql`
    query obtenerRegistrosAbiertosCPG{
        obtenerRegistrosAbiertosCPG{
            id
            creado
            modificado
            operario
            producto
            lote
            cliente
            loteBolsa
            loteBolsaID
            loteBolsaCristal
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantDescarteBolsaCristal
            cantProducida
            puesto1
            puesto2
            observaciones
            estado
        }
    }
`;

const NUEVO_REGISTRO = gql `
    mutation nuevoRegistroCPG($id: ID, $input: CPGInput){
        nuevoRegistroCPG(id:$id, input: $input){
            id
            creado
            modificado
            operario
            lote
            cliente
            loteBolsa
            loteBolsaID
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantProducida
            observaciones
            estado
            puesto1
            puesto2
        }
    }
`;

const NUEVO_DOBLE_REGISTRO = gql `
    mutation nuevoDobleRegistroCPG($id: ID, $input: CPGInput, $finalizado: Boolean){
        nuevoDobleRegistroCPG(id: $id, input: $input, finalizado: $finalizado){
            id
            creado
            modificado
            operario
            lote
            cliente
            producto
            loteBolsa
            loteBolsaCristal
            loteGel
            dobleBolsa
            manta
            cantProducida
            cantDescarte
            cantDescarteBolsaCristal
            puesto1
            puesto2
            observaciones
            estado
        }
    }
`;

const ELIMINAR_REGISTRO = gql `
    mutation eliminarRegistroCPG($id: ID!){
        eliminarRegistroCPG(id: $id)
    }
`;

const OBTENER_REGISTRO = gql `
    query obtenerRegistroCPG($id: ID!){
        obtenerRegistroCPG(id:$id){
            id
            creado
            modificado
            producto
            operario
            lote
            cliente
            loteBolsa
            loteBolsaCristal
            cantDescarteBolsaCristal
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantProducida
            puesto1
            puesto2
            observaciones
            estado
        }
    }
`;

const ACTUALIZAR_REGISTRO = gql`
    mutation actualizarRegistroCPG($id: ID!, $input: CPGInput){
        actualizarRegistroCPG(id: $id, input: $input){
            id
            creado
            modificado
            operario
            lote
            cliente
            loteBolsa
            loteBolsaID
            loteGel
            dobleBolsa
            manta
            cantDescarte
            cantProducida
            puesto1
            puesto2
            observaciones
            estado
        }
    }
`;

const GELES_EN_PROCESO = gql`
    query obtenerStockGelesEnProceso {
        obtenerStockGelesEnProceso {
            producto
            lote
            productoId
        }
    }
`;

const LISTA_REGISTROS_PREPARACION = gql `
    query obtenerRegistrosPG{
        obtenerRegistrosPG{
            id
            creado
            lote
            llenado
            cantidad
            loteInsumo
            tanque
            operario
            observaciones    
        }
    }
`;

export {
  OBTENER_REGISTROS,
  OBTENER_REGISTROS_ABIERTOS,
  NUEVO_REGISTRO,
  ELIMINAR_REGISTRO,
  OBTENER_REGISTRO,
  ACTUALIZAR_REGISTRO,
  NUEVO_DOBLE_REGISTRO,
  GELES_EN_PROCESO,
  LISTA_REGISTROS_PREPARACION,
};
