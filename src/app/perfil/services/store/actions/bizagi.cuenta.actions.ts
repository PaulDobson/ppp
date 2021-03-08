import { createAction, props } from '@ngrx/store';
import {  BizAgiWSResponse, TipodeCuenta } from '../../../../models/entidades.bizagi.models';

export const cargarTipoCuenta = createAction('[TipoCuenta Entity] cargar TipoCuenta');


export const cargarTipoCuentaSuccess = createAction(
    '[TipoCuenta Entity] cargar TipoCuenta Success',
    props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarTipoCuentaError = createAction(
    '[TipoCuenta Entity] cargar TipoCuenta Error',
    props<{ payload:any }>()
);

