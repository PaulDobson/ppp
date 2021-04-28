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
export class BizagiEstandarEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  cargarEstandar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entidadesActions.cargarEstandar),
      concatMap(
        () =>
          this.entidadesBizagiServices.initServices().pipe(
            mergeMap(() =>
              this.entidadesBizagiServices.getEntities('EstandardelaUbicacion')
            ),map((entidad) =>  entidadesActions.cargarEstandarSuccess({ bizagiResponse: entidad })
            )
            ,catchError((err:any) => of(entidadesActions.cargarEstandarError({ payload: 'error:' + err.message })))
          )
      ),catchError((err:any) => of(entidadesActions.cargarEstandarError({ payload: 'error:' + err })))
    )
  );
}
