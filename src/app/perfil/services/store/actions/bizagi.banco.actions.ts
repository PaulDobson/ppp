import { createAction, props } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';

export const cargarBanco = createAction('[Banco Entity] cargar Banco');


export const cargarBancoesSuccess = createAction(
    '[Banco Entity] cargar Banco Success',
    props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarBancoError = createAction(
    '[Banco Entity] cargar Banco Error',
    props<{ payload:any }>()
);

