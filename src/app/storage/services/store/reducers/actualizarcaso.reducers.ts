import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { actualizarCaso, actualizarCasoInicialError, actualizarCasoInicialSuccess} from '../actions/bizagi.actions';


export interface CasoIngresoUpdateInicialtate {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const CasoIngresoUpdateInitialState: CasoIngresoUpdateInicialtate = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _actualizarCasoSolicitudReducer = createReducer(CasoIngresoUpdateInitialState,

    on(actualizarCaso, state => ({ ...state, loading:true })),
    
    on( actualizarCasoInicialSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( actualizarCasoInicialError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } )),
 

);

export function ActualizarCasoSolicitudReducer(state, action) {
    return _actualizarCasoSolicitudReducer(state, action);
}