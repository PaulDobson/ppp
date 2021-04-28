import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../models/User.models';

export const setUser = createAction(
    '[Auth] setUser',
    props<{ user: Usuario }>()
);


export const setEmpresaAsociada = createAction(
    '[Auth] setEmpresaRelacionada',
    props<{ rutEmpresa: string }>()
);

export const setHabilitadoParaServicio = createAction(
    '[Auth] setHabilitadoParaServicio',
    props<{ habilitado: boolean }>()
);



export const unSetUser = createAction('[Auth] unSetUser');

