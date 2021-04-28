import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { cargarTarifa,cargarTarifaError,cargarTarifaSuccess } from '../actions/bizagi.actions';


export interface TarifaState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const TarifaInitialState: TarifaState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiTarifaReducer = createReducer(TarifaInitialState,

    on(cargarTarifa, state => ({ ...state, loading:true })),
    
    on( cargarTarifaSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarTarifaError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiTarifaReducer(state, action) {
    return _bizagiTarifaReducer(state, action);
}