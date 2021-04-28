import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { cargarParametrosSistema, cargarParametrosSistemaError, cargarParametrosSistemaSuccess, cargarTarifa,cargarTarifaError,cargarTarifaSuccess } from '../actions/bizagi.actions';


export interface ParametrosState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const ParametrosInitialState: ParametrosState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiParametrosReducer = createReducer(ParametrosInitialState,

    on(cargarParametrosSistema, state => ({ ...state, loading:true })),
    
    on( cargarParametrosSistemaSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarParametrosSistemaError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiParametrosReducer(state, action) {
    return _bizagiParametrosReducer(state, action);
}