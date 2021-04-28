import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as casoActions from '../actions/bizagi.actions';
import {
  mergeMap,
  map,
  catchError,
  concatMap,

} from 'rxjs/operators';
import { BizagiService } from '../../../../services/bizagi.service';
import { of } from 'rxjs';

@Injectable()
export class PerformActivityInicialEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  performActivityEffects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(casoActions.PerformActivity),
      concatMap(
        (param) =>
          this.entidadesBizagiServices.initServices().pipe(
            mergeMap(() =>
              this.entidadesBizagiServices.performActivity(   param.idCase, param.taskName )
            ),map((entidad) =>  casoActions.PerformActivitySuccess({ bizagiResponse: entidad })
            )
            ,catchError((err:any) => of(casoActions.PerformActivityError({ payload: 'error:' + err.message })))
          )
      ),catchError((err:any) => of(casoActions.PerformActivityError({ payload: 'error:' + err })))
    )
  );

 
}
