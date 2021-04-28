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
export class CreacionCasoInicialEffects {
  constructor(
    private actions$: Actions,
    private entidadesBizagiServices: BizagiService
  ) {}

  crearCasoIicialEffects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(casoActions.crearCasoInicial),
      concatMap(
        (param) =>
          this.entidadesBizagiServices.initServices().pipe(
            mergeMap(() =>
              this.entidadesBizagiServices.crearCasoSolicitudIngreso( param.xml)
            ),map((entidad) =>  casoActions.crearCasoInicialSuccess({ bizagiResponse: entidad })
            )
            ,catchError((err:any) => of(casoActions.crearCasoInicialError({ payload: 'error:' + err.message })))
          )
      ),catchError((err:any) => of(casoActions.crearCasoInicialError({ payload: 'error:' + err })))
    )
  );


  actualizarCasoEffects$ = createEffect(() =>
  this.actions$.pipe(
    ofType(casoActions.actualizarCaso),
    concatMap(
      (param) =>
        this.entidadesBizagiServices.initServices().pipe(
          mergeMap(() =>
            this.entidadesBizagiServices.saveEntityCase( param.xml)
          ),map((entidad) =>  casoActions.actualizarCasoInicialSuccess({ bizagiResponse: entidad })
          )
          ,catchError((err:any) => of(casoActions.actualizarCasoInicialError({ payload: 'error:' + err.message })))
        )
    ),catchError((err:any) => of(casoActions.actualizarCasoInicialError({ payload: 'error:' + err })))
  )
);


  getCaseByRutEmpresa$ = createEffect(() =>
  this.actions$.pipe(
    ofType(casoActions.getCaseByRutEmpresa),
    concatMap(
      (param) =>
        this.entidadesBizagiServices.initServices().pipe(
          mergeMap(() =>
            this.entidadesBizagiServices.getEntities( 'ControlDeAlmacenaje' , param.idCliente)
          ),map((entidad) =>  casoActions.crearCasoInicialSuccess({ bizagiResponse: entidad })
          )
          ,catchError((err:any) => of(casoActions.crearCasoInicialError({ payload: 'error:' + err.message })))
        )
    ),catchError((err:any) => of(casoActions.crearCasoInicialError({ payload: 'error:' + err })))
  )
);
}
