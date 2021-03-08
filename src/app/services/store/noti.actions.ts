import { createAction, props } from '@ngrx/store';
import { Notificacion } from 'src/app/models/Types';

export const addNotificacion = createAction('[UI notificacion] addNotificacion', props<{ noti: Notificacion }>());
export const removeNotificacion = createAction('[UI notificacion] removeNotificacion', props<{ id: string }>());
export const readNotificacion = createAction('[UI notificacion] readNotificacion', props<{ id: string }>());