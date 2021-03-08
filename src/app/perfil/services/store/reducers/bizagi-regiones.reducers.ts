import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';
import { cargarRegion, cargarRegionError,cargarRegionesSuccess } from '../actions/bizagi.region.actions';


export interface RegionState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const RegionInitialState: RegionState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiRegionReducer = createReducer(RegionInitialState,

    on(cargarRegion, state => ({ ...state, loading:true })),
    
    on( cargarRegionesSuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( cargarRegionError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiRegionReducer(state, action) {
    return _bizagiRegionReducer(state, action);
}