import { createAction, props } from '@ngrx/store';
import { BizAgiWSResponse } from '../../../../models/entidades.bizagi.models';

export const cargarProvincia= createAction('[ProvinciaEntity] cargar Provincias');


export const cargarProvinciasSuccess = createAction(
    '[ProvinciaEntity] cargar ProvinciaSuccess',
    props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarProvinciasError = createAction(
    '[ProvinciaEntity] cargar ProvinciaError',
    props<{ payload:any }>()
);

