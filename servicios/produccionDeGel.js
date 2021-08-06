import { gql } from '@apollo/client';

const OBTENER_REGISTROS = gql`
    query obtenerRegistrosCPG{
        obtenerRegistrosCPG{
            id
            creado
            modificado
            operario
            producto
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
    mutation nuevoDobleRegistroCPG($id: ID, $input: CPGInput){
        nuevoDobleRegistroCPG(id: $id, input: $input){
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

export {
  OBTENER_REGISTROS,
  NUEVO_REGISTRO,
  ELIMINAR_REGISTRO,
  OBTENER_REGISTRO,
  ACTUALIZAR_REGISTRO,
  NUEVO_DOBLE_REGISTRO,
  GELES_EN_PROCESO
};
