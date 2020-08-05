import {
    DATOS_USUARIO
} from '../../types'

export default ( state, action ) => {
    switch(action.type) {
        case DATOS_USUARIO:
            return {
                ...state,
                usuario: action.payload
            }

        default:
            return state
    }
}