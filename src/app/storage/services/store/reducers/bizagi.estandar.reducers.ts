import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse, BancodeCargo } from '../../../../models/entidades.bizagi.models';
import { cargarEstandar,cargarEstandarError,cargarEstandarSuccess } from '../actions/bizagi.actions';


export interface EstandarState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const EstandarInitialState: EstandarState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiEstandarReducer = createReducer(EstandarInitialState,

    on(cargarEstandar, state => ({ ...state, loading:true })),
    
    on( cargarEstandarSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarEstandarError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiEstandarReducer(state, action) {
    return _bizagiEstandarReducer(state, action);
}