import { createReducer, on } from '@ngrx/store';
import { setEmpresa, unSetEmpresa } from './empresa.actions';
import { EmpresaAsociada } from '../../models/User.models';

export interface State {
    empresa: EmpresaAsociada; 
}

export const initialState: State = {
   empresa: null,
}

const _empresaReducer = createReducer(initialState,

    on( setEmpresa, (state, { empresa }) => ({ ...state, empresa: { ...empresa }  })),
    on( unSetEmpresa, state => ({ ...state, empresa: null  })),

);

export function empresaReducer(state, action) {
    return _empresaReducer(state, action);
}