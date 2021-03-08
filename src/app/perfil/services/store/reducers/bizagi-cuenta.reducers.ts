import { createReducer, on } from '@ngrx/store';
import {  BizAgiWSResponse, TipodeCuenta } from '../../../../models/entidades.bizagi.models';
import { cargarTipoCuenta, cargarTipoCuentaError,cargarTipoCuentaSuccess } from '../actions/bizagi.Cuenta.actions';


export interface CuentaState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const CuentaInitialState: CuentaState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiCuentaReducer = createReducer(CuentaInitialState,

    on(cargarTipoCuenta, state => ({ ...state, loading:true })),
    
    on( cargarTipoCuentaSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarTipoCuentaError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiCuentaReducer(state, action) {
    return _bizagiCuentaReducer(state, action);
}