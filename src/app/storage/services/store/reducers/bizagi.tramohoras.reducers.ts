import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse, BancodeCargo } from '../../../../models/entidades.bizagi.models';
import { cargarTramoHoras,cargarTramoHorasError,cargarTramoHorasSuccess } from '../actions/bizagi.actions';


export interface TramoHorasState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const TramoHorasInitialState: TramoHorasState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiTramoHorasReducer = createReducer(TramoHorasInitialState,

    on(cargarTramoHoras, state => ({ ...state, loading:true })),
    
    on( cargarTramoHorasSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarTramoHorasError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiTramoHorasReducer(state, action) {
    return _bizagiTramoHorasReducer(state, action);
}