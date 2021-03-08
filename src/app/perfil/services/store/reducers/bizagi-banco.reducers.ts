import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse, BancodeCargo } from '../../../../models/entidades.bizagi.models';
import { cargarBanco, cargarBancoError,cargarBancoesSuccess } from '../actions/bizagi.Banco.actions';


export interface BancoState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const BancoInitialState: BancoState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiBancoReducer = createReducer(BancoInitialState,

    on(cargarBanco, state => ({ ...state, loading:true })),
    
    on( cargarBancoesSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarBancoError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiBancoReducer(state, action) {
    return _bizagiBancoReducer(state, action);
}