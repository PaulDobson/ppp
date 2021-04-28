import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";
import { AppState } from "src/app/app.reducer";
import {
  ControlDeAlmacenaje,
  DetalledeUbicacionesDis,
  ListadodeHorasDisponiblesClass,
  ListadodeHorasParaRetiroClass,
  ReservadePosicionesClass,
} from "src/app/models/ControlDeAlmacenaje.model";
import {
  BizAgiWSResponse,
  DetalledeUbicacionesDisp,
  ReservaPosiciones,
  TramodeHoras,
  _casoControlAlmacenaje,
} from "src/app/models/entidades.bizagi.models";
import { BizagiService } from "src/app/services/bizagi.service";
import { environment } from "src/environments/environment";
import {
  obtenerUbicacionXDia,
  getCaseByRutEmpresa,
  actualizarUbicacion,
} from "./store/actions/bizagi.actions";
import {
  crearCasoInicial,
  actualizarCaso,
} from "./store/actions/bizagi.actions";
import { SubSink } from "Subsink";
@Injectable()
export class StorageService {
  subs = new SubSink();

  constructor(
    public bizagiService: BizagiService,
    private store: Store<AppState>
  ) {}

  ObtenerUbicacionXDia(estado: string, estandar: string, fechaIngreso: string) {
    let filters: string = `EstadodelaUbicacion=${estado} and EstandardelaUbicacion=${estandar} and FechadeIngreso='${fechaIngreso}'`;
    this.store.dispatch(obtenerUbicacionXDia({ filtro: filters }));
  }

  prepararCreacionSolicitud(idEmpresa: string) {
    console.log(
      "Se creara registro solicitud para usuario, idEmpresa: ",
      idEmpresa
    );
    let control: ControlDeAlmacenaje = new ControlDeAlmacenaje();
    control.userName = environment.usuario_creador_caso;
    control.domain = environment.domain;
    control.Process = "ControlDeAlmacenaje";
    control.Cliente = idEmpresa;
    this.store.dispatch(
      crearCasoInicial({ xml: control.toXMLCreateInitialCase() })
    );
  }

  procesarRetiro(
    listadoPallets: DetalledeUbicacionesDisp[],
    fecha: string,
    numeroCaso: string,
    horario: TramodeHoras[]
  ) {
    let control: ControlDeAlmacenaje = new ControlDeAlmacenaje();
    control.userName = environment.usuario_creador_caso;
    control.domain = environment.domain;
    control.Process = environment.proceso;
    control.FechaHoraRetiro = fecha;

    let XML_Entity: string = "";
    var ControlAlmacenajeKey: number;
    listadoPallets.forEach((x, indice) => {
      ControlAlmacenajeKey = x.ControlDeAlmacenaje;
      XML_Entity += `<NewUbicaciones key="${x.CodUbicacionNew}">
        <EstadodelaUbicacion entityName="EstadodelaUbicacion"> <CodEstado>003</CodEstado></EstadodelaUbicacion>
        </NewUbicaciones>`;

      let listadoRetiro = new ListadodeHorasParaRetiroClass();
      listadoRetiro.Seleccionado = true;
      listadoRetiro.Tramosdisponibles = horario[indice].id;
      control.ListadodeHorasParaRetiroClass.push(listadoRetiro);

      control.DetalledeUbicacionesDis.push({
        SeleccionarRetiro: true,
        key: x._attributes.key,
      });
    });

    control.idCase = ControlAlmacenajeKey.toString();

    //this.store.dispatch( actualizarUbicacion( {filtro:XML_Entity} ) );

    //console.log("actualizacion Caso XML", control.toXMLUpdateRetiroCase());
    //this.store.dispatch(actualizarCaso({xml:control.toXMLUpdateRetiroCase()}));

    return this.bizagiService.initServices$.pipe(
      switchMap((estado) => {
        if (estado) {
          return this.bizagiService
            .saveEntityCase(control.toXMLUpdateRetiroCase())
            .pipe(
              switchMap((respuesta: BizAgiWSResponse) => {
                console.log("saveEntityCase", respuesta);
                if (
                  respuesta.Entities.ControlDeAlmacenaje != null &&
                  respuesta.Entities.ControlDeAlmacenaje != ""
                ) {
                  return this.bizagiService.saveEntity(XML_Entity).pipe(
                    switchMap((response: BizAgiWSResponse) => {
                      console.log("saveEntity", response);
                      if (
                        response.Entities.NewUbicaciones != null &&
                        response.Entities.NewUbicaciones != ""
                      ) {
                        console.log(
                          "performActivity",
                          control.idCase,
                          environment.taskIdSolicitarRetiro
                        );
                        return this.bizagiService.performActivity(
                          numeroCaso,
                          environment.taskIdSolicitarRetiro
                        );
                      } else {
                        //return false;
                      }
                    })
                  );
                } else {
                  //return  false ;
                }
              })
            );
        }
      })
    );

    /*
    this.subs.sink =  this.bizagiService.initServices$.subscribe(  estado=>{
      if(estado){
        try {
          this.subs.sink =  this.bizagiService.saveEntityCase(  control.toXMLUpdateRetiroCase() ).subscribe( (respuesta:BizAgiWSResponse)=>{

            if( respuesta.Entities.ControlDeAlmacenaje != null && respuesta.Entities.ControlDeAlmacenaje != ""){
              
              try {
                this.subs.sink =  this.bizagiService.saveEntity(  XML_Entity ).subscribe( (response:BizAgiWSResponse)=>{

                  if( response.Entities.NewUbicaciones != null &&  response.Entities.NewUbicaciones != "" ){
                    this.subs.unsubscribe();

                    return this.bizagiService.performActivity(control.idCase, environment.taskIdSolicitarRetiro);

                  }else{
                    this.subs.unsubscribe();
                    return of(false);
                  }

                  

                } );
              } catch (error) {
                this.subs.unsubscribe();
                 return of(false);
              }
          

 
            }else{
              this.subs.unsubscribe();
              return of(false);
            }
            
 
          } );
        } catch (error) {
          this.subs.unsubscribe();
          return of(false);
        }
     

      }else{

        this.subs.unsubscribe();
        return of(false);
      }
    } )
    */
  }
  actualizarCasoRecepcion(
    reservaPosiciones: ReservaPosiciones[],
    horario: TramodeHoras[],
    materialPeligroso: string,
    CasoEnCursoControlAlmacenaje: string,
    diaDespachoSeleccionado: string,
    banco:string,
    tipoPago:string,
    tipoCuenta:string,
    numCuenta:string
  ) {

    let control: ControlDeAlmacenaje = new ControlDeAlmacenaje();
    control.userName = environment.usuario_creador_caso;
    control.domain = environment.domain;
    control.Process = environment.proceso;
   
    control.DeclaraquenocontieneM = materialPeligroso;
    control.idCase = CasoEnCursoControlAlmacenaje;
    control.FechaHoraIngreso = diaDespachoSeleccionado;
    control.banco = banco;
    control.tipoPago = tipoPago;
    control.tipoCuenta = tipoCuenta;
    control.numCuenta = numCuenta;

    var cantidadRequeridaTemp: number = 0;
    reservaPosiciones.forEach((reserva) => {
      let reservaPosicion = new ReservadePosicionesClass();
      reservaPosicion.CantidadRequerida = reserva.CantidadRequerida;
      reservaPosicion.CodigodeEstandar = reserva.CodigodeEstandar;
      reservaPosicion.ObservacionesAdicionales =
        reserva.ObservacionesAdicionales;
      //reservaPosicion.Standar = reserva.Standar;
      reservaPosicion.TipodeTarifa = reserva.TipodeTarifa;
      if (reserva._attributes != null && reserva._attributes.key != null) {
        reservaPosicion.key = reserva._attributes.key;
      }
      cantidadRequeridaTemp += reserva.CantidadRequerida;

      control.ReservadePosiciones.push(reservaPosicion);
    });

    horario.forEach((tramo) => {
      let tramoDisponible = new ListadodeHorasDisponiblesClass();

      if (tramo.seleccionado) {
        if (cantidadRequeridaTemp > 10) {
          tramoDisponible.CantidadReservada = 10;
          cantidadRequeridaTemp -= 10;
        } else {
          tramoDisponible.CantidadReservada = cantidadRequeridaTemp;
        }
      } else {
        tramoDisponible.CantidadReservada = 0;
      }

      tramoDisponible.FechadeIngreso = diaDespachoSeleccionado;
      tramoDisponible.Seleccionado = tramo.seleccionado;
      tramoDisponible.Tramosdisponibles = tramo.id;
      if (tramo._attributes != null && tramo._attributes.key != null) {
        tramoDisponible.key = tramo._attributes.key;
      }
      control.ListadodeHorasDisponibl.push(tramoDisponible);
    });

    this.store.dispatch(actualizarCaso({ xml: control.toXMLUpdateCase() }));
  }

  getCasosPendientes(idCliente: string, estado: string): void {
    this.store.dispatch(
      getCaseByRutEmpresa({
        idCliente: `Cliente=${idCliente} And EnCompletarRegistro=${estado}`,
      })
    );
  }

  getCasosDisponibleParaRetiro(idCliente: string, estado: string): void {
    this.store.dispatch(
      getCaseByRutEmpresa({
        idCliente: `Cliente=${idCliente} And DisponibleparaRetiro=${estado}`,
      })
    );
  }

  getFrecuenciaCobro() {
    return this.bizagiService.getEntities("FrecuenciadeCobro").pipe(
      map((response) => {
        if (response.Entities) {
          var frecuencias: [] = response.Entities.FrecuenciadeCobro;
          return frecuencias;
        }
      })
    );
  }

  ngOnDestroy() {
    //console.log('ngOnDestroy: cleaning up...');
  }
}
