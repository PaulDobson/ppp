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
export class BizagiParametrosEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  cargarParametrosEffects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entidadesActions.cargarParametrosSistema),
      concatMap(
        () =>
          this.entidadesBizagiServices.initServices().pipe(
            mergeMap(() =>
              this.entidadesBizagiServices.getEntities('ParametrosdeSistema')
            ),map((entidad) =>  entidadesActions.cargarParametrosSistemaSuccess({ bizagiResponse: entidad })
            )
            ,catchError((err:any) => of(entidadesActions.cargarParametrosSistemaError({ payload: 'error:' + err.message })))
          )
      ),catchError((err:any) => of(entidadesActions.cargarParametrosSistemaError({ payload: 'error:' + err })))
    )
  );
  
}
