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
export class BizagiTarifaEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  cargarTarifa$ = createEffect(() =>
    this.actions$.pipe(
      ofType(entidadesActions.cargarTarifa),
      concatMap(
        () =>
          this.entidadesBizagiServices.initServices().pipe(
            mergeMap(() =>
              this.entidadesBizagiServices.getEntities('TipodeTarifa')
            ),map((entidad) =>  entidadesActions.cargarTarifaSuccess({ bizagiResponse: entidad })
            )
            ,catchError((err:any) => of(entidadesActions.cargarTarifaError({ payload: 'error:' + err.message })))
          )
      ),catchError((err:any) => of(entidadesActions.cargarTarifaError({ payload: 'error:' + err })))
    )
  );
  
}
