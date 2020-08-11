import {
    DATOS_USUARIO, 
    LISTA_INSUMOS, 
    LISTA_PRODUCTOS
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
        case LISTA_PRODUCTOS:
            return {
                ...state,
                productos: action.payload
            }
        default:
            return state
    }
}