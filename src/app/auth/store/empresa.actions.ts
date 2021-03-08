import { createAction, props } from '@ngrx/store';
import { EmpresaAsociada, Usuario } from '../../models/User.models';

export const setEmpresa = createAction(
    '[Auth] setEmpresa',
    props<{ empresa: EmpresaAsociada }>()
);

export const unSetEmpresa = createAction('[Auth] unSetEmpresa');

