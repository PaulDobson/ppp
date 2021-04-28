import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { crearCasoInicial, crearCasoInicialSuccess, crearCasoInicialError , getCaseByRutEmpresa} from '../actions/bizagi.actions';


export interface CasoIngresoInicialtate {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const CasoIngresoInicialInitialState: CasoIngresoInicialtate = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _casoSolicitudReducer = createReducer(CasoIngresoInicialInitialState,

    on(crearCasoInicial, state => ({ ...state, loading:true })),
    
    on( crearCasoInicialSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( crearCasoInicialError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } )),
    on(getCaseByRutEmpresa, state => ({ ...state, loading:true })),

);

export function CasoSolicitudReducer(state, action) {
    return _casoSolicitudReducer(state, action);
}