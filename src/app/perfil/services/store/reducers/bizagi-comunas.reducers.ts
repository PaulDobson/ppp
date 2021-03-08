import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { cargarComunas, cargarTipoComunasError, cargarTipoComunasSuccess } from '../actions/bizagi.comuna.actions';


export interface ComunaState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const entidadesInitialState: ComunaState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiComunasReducer = createReducer(entidadesInitialState,

    on( cargarComunas, state=>({ ...state, loading:true }) ),
    on( cargarTipoComunasSuccess,(  state, {bizagiResponse} )=>({
        ...state, 
        loading:false,
        loaded:true,
        bizagiResponse:bizagiResponse
    }) ),
    on( cargarTipoComunasError,(  state, {payload} )=>({
        ...state, 
        loading:false,
        loaded:true,
        error:payload
    }) )

);

export function BizagiComunasReducer(state, action) {
    return _bizagiComunasReducer(state, action);
}