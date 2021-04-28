import { createAction, props } from '@ngrx/store';
import { EmpresaAsociada } from '../../models/entidades.bizagi.models';

export const setEmpresa = createAction(
    '[Auth] setEmpresa',
    props<{ empresa: EmpresaAsociada }>()
);

export const unSetEmpresa = createAction('[Auth] unSetEmpresa');

