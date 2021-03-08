import { createAction, props } from '@ngrx/store';
import { BizAgiWSResponse, Region } from '../../../../models/entidades.bizagi.models';

export const cargarRegion = createAction('[Region Entity] cargar Region');


export const cargarRegionesSuccess = createAction(
    '[Region Entity] cargar Region Success',
    props<{ bizagiResponse:BizAgiWSResponse }>()
);
export const cargarRegionError = createAction(
    '[Region Entity] cargar Region Error',
    props<{ payload:any }>()
);

