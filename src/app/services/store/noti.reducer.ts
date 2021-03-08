import { createReducer, on } from '@ngrx/store';
import {addNotificacion, removeNotificacion, readNotificacion} from './noti.actions';
import {Notificacion} from '../../models/Types';

export interface State {
    noti: Notificacion; 
}

export const initialState: State = {
   noti: null,
}

const _authReducer = createReducer(initialState,

    on( addNotificacion, (state, { noti }) => ({ ...state, noti: { ...noti }  })),

);

export function authReducer(state, action) {
    return _authReducer(state, action);
}