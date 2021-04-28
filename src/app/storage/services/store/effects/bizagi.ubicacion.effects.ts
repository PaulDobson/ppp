import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as entidadesActions from '../actions/bizagi.actions';
import {
  mergeMap,
  map,
  catchError,
  concatMap,

} from 'rxjs/operators';
import { BizagiService } from '../../../../services/bizagi.service';
import { of } from 'rxjs';

@Injectable()
export class BizagiUbicacionesEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  cargarUbicacionesXDia$ = createEffect(() =>
  this.actions$.pipe(
    ofType(entidadesActions.obtenerUbicacionXDia),
    concatMap(
      (param) =>
        this.entidadesBizagiServices.initServices().pipe(
          mergeMap(() =>
            this.entidadesBizagiServices.getEntities('NewUbicaciones', param.filtro)
          ),map((entidad) =>  entidadesActions.obtenerUbicacionXDiaSuccess({ bizagiResponse: entidad })
          )
          ,catchError((err:any) => of(entidadesActions.obtenerUbicacionXDiaError({ payload: 'error:' + err.message })))
        )
    ),catchError((err:any) => of(entidadesActions.obtenerUbicacionXDiaError({ payload: 'error:' + err })))
  )
);


cargarUbicacionesXCaso$ = createEffect(() =>
this.actions$.pipe(
  ofType(entidadesActions.obtenerUbicacionCaso),
  concatMap(
    (param) =>
      this.entidadesBizagiServices.initServices().pipe(
        mergeMap(() =>
          this.entidadesBizagiServices.getEntities('NewUbicaciones', param.filtro)
        ),map((entidad) =>  entidadesActions.obtenerUbicacionCasoSuccess({ bizagiResponse: entidad })
        )
        ,catchError((err:any) => of(entidadesActions.obtenerUbicacionCasoError({ payload: 'error:' + err.message })))
      )
  ),catchError((err:any) => of(entidadesActions.obtenerUbicacionCasoError({ payload: 'error:' + err })))
)
);


actualizarUbicacion$ = createEffect(() =>
this.actions$.pipe(
  ofType(entidadesActions.actualizarUbicacion),
  concatMap(
    (param) =>
      this.entidadesBizagiServices.initServices().pipe(
        mergeMap(() =>
          this.entidadesBizagiServices.saveEntity(param.filtro)
        ),map((entidad) =>  entidadesActions.actualizarUbicacionSuccess({ bizagiResponse: entidad })
        )
        ,catchError((err:any) => of(entidadesActions.actualizarUbicacionError({ payload: 'error:' + err.message })))
      )
  ),catchError((err:any) => of(entidadesActions.actualizarUbicacionError({ payload: 'error:' + err })))
)
);

}
