import {
    DATOS_USUARIO, LISTA_INSUMOS
} from '../../types'

export default ( state, action ) => {
    switch(action.type) {
        case DATOS_USUARIO:
            return {
                ...state,
                usuario: action.payload
            }
        case LISTA_INSUMOS:
            return {
                ...state,
                insumos: action.payload
            }
        default:
            return state
    }
}