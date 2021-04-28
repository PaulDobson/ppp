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
export class BizagiTramoHorasEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  cargarTramoHoras$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entidadesActions.cargarTramoHoras),
      concatMap(
        () =>
          this.entidadesBizagiServices.initServices().pipe(
            mergeMap(() =>
              this.entidadesBizagiServices.getEntities('TramodeHoras')
            ),map((entidad) =>  entidadesActions.cargarTramoHorasSuccess({ bizagiResponse: entidad })
            )
            ,catchError((err:any) => of(entidadesActions.cargarTramoHorasError({ payload: 'error:' + err.message })))
          )
      ),catchError((err:any) => of(entidadesActions.cargarTramoHorasError({ payload: 'error:' + err })))
    )
  );
}
