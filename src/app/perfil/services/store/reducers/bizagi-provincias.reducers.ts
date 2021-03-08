import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { cargarProvincia, cargarProvinciasError,cargarProvinciasSuccess } from '../actions/bizagi.provincia.actions';


export interface ProvinciaState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const ProvinciaInitialState: ProvinciaState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiProvinciaReducer = createReducer(ProvinciaInitialState,

    on(cargarProvincia, state => ({ ...state, loading:true })),
    
    on( cargarProvinciasSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarProvinciasError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiProvinciaReducer(state, action) {
    return _bizagiProvinciaReducer(state, action);
}