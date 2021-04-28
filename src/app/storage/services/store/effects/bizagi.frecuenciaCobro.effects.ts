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
export class BizagiFrecuenciaCobroEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  cargarFrecuenciaCobro$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entidadesActions.cargarFrecuenciaCobro),
      concatMap(
        () =>
          this.entidadesBizagiServices.initServices().pipe(
            mergeMap(() =>
              this.entidadesBizagiServices.getEntities('TipodePago')
            ),map((entidad) =>  entidadesActions.cargarFrecuenciaCobroSuccess({ bizagiResponse: entidad })
            )
            ,catchError((err:any) => of(entidadesActions.cargarFrecuenciaCobroError({ payload: 'error:' + err.message })))
          )
      ),catchError((err:any) => of(entidadesActions.cargarFrecuenciaCobroError({ payload: 'error:' + err })))
    )
  );
}
