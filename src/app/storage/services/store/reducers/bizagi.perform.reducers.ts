import { createReducer, on } from '@ngrx/store';
import { BizAgiWSResponse, Ubicaciones } from '../../../../models/entidades.bizagi.models';
import { PerformActivity, PerformActivityError, PerformActivitySuccess } from '../actions/bizagi.actions';


export interface PerformActivityState {
    bizagiResponse: BizAgiWSResponse,
    loaded:boolean,
    loading:boolean,
    error:any 
}

export const PerformActivityInitialState: PerformActivityState = {
    bizagiResponse: null,
    loaded:false,
    loading:false,
    error:null 
}

const _bizagiPerformActivityReducer = createReducer(PerformActivityInitialState,

 

    on(PerformActivity, state => ({ ...state, loading:true })),
    
    on( PerformActivitySuccess,(state , {bizagiResponse})=>({
        ...state,
        loading:false,
        loaded:true,
        bizagiResponse: bizagiResponse
    } )),
    on( PerformActivityError,(state , { payload })=>({
        ...state,
        loading:false,
        loaded:false,
        error:payload
    } ))

);

export function BizagiPerformActivityReducer(state, action) {
    return _bizagiPerformActivityReducer(state, action);
}