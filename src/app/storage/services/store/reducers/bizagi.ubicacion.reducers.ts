import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse, Ubicaciones } from '../../../../models/entidades.bizagi.models';
import {  actualizarUbicacion, actualizarUbicacionError, actualizarUbicacionSuccess, obtenerUbicacionCaso, obtenerUbicacionCasoError, obtenerUbicacionCasoSuccess, obtenerUbicacionXDia, obtenerUbicacionXDiaError, obtenerUbicacionXDiaSuccess } from '../actions/bizagi.actions';


export interface UbicacionesState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const UbicacionesInitialState: UbicacionesState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiUbicacionesReducer = createReducer(UbicacionesInitialState,
    on(obtenerUbicacionXDia, state => ({ ...state, loading:true })),
    
    on( obtenerUbicacionXDiaSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( obtenerUbicacionXDiaError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);


const _bizagiActualizacionUbicacionesReducer = createReducer(UbicacionesInitialState,
    on(actualizarUbicacion, state => ({ ...state, loading:true })),
    
    on( actualizarUbicacionSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( actualizarUbicacionError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);


const _bizagiUbicacionesCasoReducer = createReducer(UbicacionesInitialState,
    on(obtenerUbicacionCaso, state => ({ ...state, loading:true })),
    
    on( obtenerUbicacionCasoSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( obtenerUbicacionCasoError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiUbicacionesCasoReducer(state, action) {
    return _bizagiUbicacionesCasoReducer(state, action);
}



export function BizagiUbicacionesReducer(state, action) {
    return _bizagiUbicacionesReducer(state, action);
}

export function BizagiActualizacionUbicacionesReducer(state, action) {
    return _bizagiActualizacionUbicacionesReducer(state, action);
}