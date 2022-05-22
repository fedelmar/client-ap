import { gql } from '@apollo/client';

const LISTA_REGISTROS = gql `
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

const LISTA_REGISTROS_POR_FECHA = gql`
    query getRegsByDatePG($input: DateRange!) {
        getRegsByDatePG(input: $input){
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
  LISTA_REGISTROS,
  LISTA_REGISTROS_POR_FECHA,
};
