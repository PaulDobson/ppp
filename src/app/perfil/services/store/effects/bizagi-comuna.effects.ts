import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as comunaActions from '../actions/bizagi.comuna.actions';
import {
  mergeMap,
  map,
  catchError,
  concatMap,
} from 'rxjs/operators';
import { BizagiService } from '../../../../services/bizagi.service';
 
import {  of } from 'rxjs';

@Injectable()
export class BizagiComunaEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  cargarComuna$ = createEffect(() =>
  this.actions$.pipe(
    ofType(comunaActions.cargarComunas),
    concatMap(
      () =>
        this.entidadesBizagiServices.initServicesWF().pipe(
          mergeMap(() =>
            this.entidadesBizagiServices.getEntities('Comuna')
          ),map((entidad) =>  comunaActions.cargarTipoComunasSuccess({ bizagiResponse: entidad })
          )
          ,catchError((err:any) => of(comunaActions.cargarTipoComunasError({ payload: 'error:' + err.message })))
        )
    ),catchError((err:any) => of(comunaActions.cargarTipoComunasError({ payload: 'error:' + err })))
  )
);
}
