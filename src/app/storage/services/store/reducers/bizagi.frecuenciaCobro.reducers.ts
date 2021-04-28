import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { cargarFrecuenciaCobro,cargarFrecuenciaCobroError, cargarFrecuenciaCobroSuccess } from '../actions/bizagi.actions';


export interface FrecuenciaCobroState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const FrecuenciaCobroInitialState: FrecuenciaCobroState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiFrecuenciaCobroReducer = createReducer(FrecuenciaCobroInitialState,

    on(cargarFrecuenciaCobro, state => ({ ...state, loading:true })),
    
    on( cargarFrecuenciaCobroSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarFrecuenciaCobroError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiTFrecuenciaCobroReducer(state, action) {
    return _bizagiFrecuenciaCobroReducer(state, action);
}