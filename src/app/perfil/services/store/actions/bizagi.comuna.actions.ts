import { createAction, props } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';

export const cargarComunas = createAction('[Comunas Entity] cargar Comunas');


export const cargarTipoComunasSuccess = createAction(
    '[Comunas Entity] cargar Comunas Success',
    props<{ bizagiResponse: BizAgiWSResponse}>()
);
export const cargarTipoComunasError = createAction(
    '[Comunas Entity] cargar Comunas Error',
    props<{ payload:any }>()
);