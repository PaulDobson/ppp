import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { DetalledeUbicacionesDisp, TramodeHoras, _casoControlAlmacenaje, _detalleOrdenamientoResumen, _UbicacionesDisponibles } from 'src/app/models/entidades.bizagi.models';
import { showNotification } from 'src/app/services/helpers';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import { environment } from 'src/environments/environment';
import { SubSink } from "Subsink";
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';
import { cargarParametrosSistema, cargarTramoHoras, obtenerUbicacionCaso } from '../../services/store/actions/bizagi.actions';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, AfterViewInit, OnDestroy{
  private subs = new SubSink();
  datasourcePallets = new MatTableDataSource<DetalledeUbicacionesDisp>();
  numeroCaso:string='';
  fechaIngreso:Date;
  minDateReserva: Date = new Date();
  listadoPallets:DetalledeUbicacionesDisp[]=[];
  cantidadPalletsSeleccionados:number=0;

  diaRetiroSeleccionado:Date;
  datasourceTramosHoras = new MatTableDataSource<TramodeHoras>();
  listadoHoras: TramodeHoras[] = [];
  listadoParametros:[]=[];
  displayedColumnsTramoHoras: string[] = [
    "horaDisponible",
    "fechaIngreso",
    "reservar",
  ];


  displayedColumns: string[] = [
    "bodega",
    "pallet",
    "fisica",
    "estandar",
    "estado",
    "seleccion"
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidadTramos: number=0;


  constructor(
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private store: Store<AppState>,
    public storageService: StorageService,
    public datepipe: DatePipe) {

   }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.datasourcePallets.paginator = this.paginator;
    this.datasourceTramosHoras.data = this.listadoHoras;
  }

  ngOnInit(): void {
    this.minDateReserva.setDate(this.minDateReserva.getDate() + 1);
    let rutas:any= this.collectRouteParams(this.router);
    this.numeroCaso = rutas.numCaso;

    this.store.dispatch(cargarTramoHoras());
    this.store.dispatch(cargarParametrosSistema());
    
    this.addListener();
  }
  addListener() {

    this.subs.sink = this.store.select('parametros').subscribe( parametros=>{
      if( parametros.loaded ){
         
        let listadoParametros:[] = parametros.bizagiResponse.Entities.ParametrosSistema;
        if( listadoParametros != null && listadoParametros.length > 0 ){
          this.listadoParametros = [...listadoParametros];
        }
      }
    } );


    /*
    this.subs.sink =this.store.select('actualizacionUbicaciones').subscribe(estado=>{
        if( estado.loaded ){
          console.log(estado.bizagiResponse);
          if(  estado.bizagiResponse.Entities != null && estado.bizagiResponse.Entities.Error != null && estado.bizagiResponse.Entities.Error!=""){
            //showNotification("Ha ocurrido un error al procesar el retiro., por favor contactese con nosotros al correo mesaayuda@payperpallet.cl");
            Swal.fire({
              title:'Error',
              icon:'error',
              allowOutsideClick:false,
              text:'Ha ocurrido un error al procesar la solicitud.'
            })
          }else{
            Swal.fire({
              title:'Solicitud procesada exitosamente',
              icon:'success',
              timer:2000,
              text:'La solicitud de retiro se ha cursado exitosamente.'
            }).then(()=>{
             
            });
          }
         
        }else if(  estado.error ){
          showNotification("Ha ocurrido un error al procesar el retiro., por favor contactese con nosotros al correo mesaayuda@payperpallet.cl");
        }
         
    });
    */

  
      this.subs.sink = this.store.select('registroSolicitud').pipe(
        map( estado=>{
          if( estado.loaded ){
            if( estado.bizagiResponse.Entities.ControlDeAlmacenaje != null ){
              var casosDisponibles:_casoControlAlmacenaje[]=[];
              if( Array.isArray( estado.bizagiResponse.Entities.ControlDeAlmacenaje ) ){
                casosDisponibles = estado.bizagiResponse.Entities.ControlDeAlmacenaje;
              }else{
                casosDisponibles.push( estado.bizagiResponse.Entities.ControlDeAlmacenaje );
              }
  
              return casosDisponibles.filter(x=>x.NumerodeCaso ==  this.numeroCaso)[0];
            }
          }
        } )
      ).subscribe(resp=>{
  
        
          if( resp != null ){
  
            this.listadoPallets = [...resp.DetalledeUbicacionesDis.DetalledeUbicacionesDisp];
            this.datasourcePallets.data = this.listadoPallets;
            this.fechaIngreso = resp.FechaHoraIngreso;
    
            
            this.store.dispatch( obtenerUbicacionCaso( { filtro: `NumerodeCaso='${this.numeroCaso}'`  }  )  );
          } 
          
      });
    



    this.subs.sink = this.store.select('ubicacionesCaso').subscribe( estado=>{
      if( estado.loading ){
        //this.store.dispatch(isLoading());
      }else if( estado.loaded ){
        //this.store.dispatch(stopLoading());

        if (estado.bizagiResponse.Entities != "") {
          
          this.poblarUbicaciones(estado.bizagiResponse.Entities.NewUbicaciones);
       
        }
      }else{
        //this.store.dispatch(stopLoading());
      }
    } );


         /**
         * TRAMO HORAS
         */
         this.subs.sink = this.store
         .select("tramohoras")
         .pipe(
           map((estado) => {
             let listado: TramodeHoras[] = [];
             if (estado.loaded && estado.error == null) {
               estado.bizagiResponse.Entities.TramodeHoras.forEach((tramo) => {
                 listado.push({
                   CodigoTramo: tramo.CodigoTramo,
                   Tramo: tramo.Tramo,
                   id: tramo._attributes.key,
                   seleccionado: false,
                   activo: true,
                 });
               });
             }
             return listado;
           })
         )
         .subscribe((listado) => {
           if (listado) {
             this.listadoHoras = [...listado];
             this.datasourceTramosHoras.data = [...this.listadoHoras];
           }
         });

  }

    //valida si la cantidad de tramos seleccionados cumple con la requerida
    changeChecbox(tramo, evento): void {
      tramo.seleccionado = evento;
      let totalSeleccionados = this.datasourceTramosHoras.data.filter(
        (t) => t.seleccionado == true
      ).length;
  
      if (totalSeleccionados == this.cantidadTramos) {
        this.desactivarTramosHorarioSinSeleccion();
      } else {
        this.activarTramosHorarios();
      }
    }

    changeCheckboxPallet(pallet, evento): void {
      
      pallet.seleccionado = evento;
      this.cantidadPalletsSeleccionados = this.datasourcePallets.data.filter( (t) => t.seleccionado == true ).length;
      this.calcularCantidadTramos();

      let totalTramosSeleccionados = this.datasourceTramosHoras.data.filter( (t) => t.seleccionado == true ).length;
  
      if (totalTramosSeleccionados == this.cantidadTramos) {
        this.desactivarTramosHorarioSinSeleccion();
      }else if( totalTramosSeleccionados > this.cantidadTramos){

        let tramos= this.datasourceTramosHoras.data.filter( (t) => t.seleccionado == true );
        tramos[tramos.length-1].seleccionado = false;
        this.desactivarTramosHorarioSinSeleccion();
      } 
      else {
        this.activarTramosHorarios();
        
      }

    }

    activarTramosHorarios(){
      this.datasourceTramosHoras.data.forEach((x) => (x.activo = true));
    }
    desactivarTramosHorarioSinSeleccion(){
      let tramosRestantes: TramodeHoras[] = this.datasourceTramosHoras.data.filter(
        (t) => t.seleccionado == false
      );
      tramosRestantes.forEach((x) => (x.activo = false));
    }

  calcularCantidadTramos() {
    let pCapacidad:any = this.listadoParametros.find( (p:any)=>p.CodParametro == environment.id_cantidadMaximaRetiro  );
    let capacidad: number = 30;
    if( pCapacidad != undefined || pCapacidad != null){
      capacidad = pCapacidad.Valor;
    }

    if( capacidad > 1 ){
      if (this.cantidadPalletsSeleccionados % capacidad == 0) {
        this.cantidadTramos = this.cantidadPalletsSeleccionados / capacidad;
      } else {
        this.cantidadTramos = Math.ceil( this.cantidadPalletsSeleccionados / capacidad );
      }
    }else{
      this.cantidadTramos = this.cantidadPalletsSeleccionados;
    }


    //return this.cantidadTramos  
  }


  poblarUbicaciones(NewUbicaciones: any) {
    
    let listadoUbicaciones:_UbicacionesDisponibles[] = [];

    if( Array.isArray( NewUbicaciones ) ){
      listadoUbicaciones = NewUbicaciones;
    }else{
      listadoUbicaciones.push(NewUbicaciones);
    }

    let ubicacionParaDespliegue:DetalledeUbicacionesDisp[]=[];
    this.listadoPallets.map(  ubicacion=>{
        let newUbicacion = listadoUbicaciones.find(  (x)=>x._attributes.key === ubicacion.CodUbicacionNew );
        var obj:DetalledeUbicacionesDisp = {...ubicacion};
        obj.DescEstandar = newUbicacion.EstandardelaUbicacion.DescEstandar;
        obj.Bodega =  newUbicacion.Bodega.DescBodega;
        obj.CodigoUbicacionFisica = newUbicacion.CodigoUbicacionFisica;
        obj.CodEstadoUbicacion = newUbicacion.EstadodelaUbicacion.CodEstado;
        obj.DescEstadoUbicacion = newUbicacion.EstadodelaUbicacion.DescripcionEstado;
        if( newUbicacion.EstadodelaUbicacion.CodEstado == "003" ){
          obj.seleccionado=true;
        }else{
          obj.seleccionado=false;
        }
        
        ubicacionParaDespliegue.push(obj);

    } );
 

     this.datasourcePallets.data = [...ubicacionParaDespliegue];

  }

  volverMenuInicio():void{
    this.router.navigate(["../"], { relativeTo: this.activatedRoute });
  }

  collectRouteParams(router: Router) {
    let params = {};
    let stack: ActivatedRouteSnapshot[] = [router.routerState.snapshot.root];
    while (stack.length > 0) {
      const route = stack.pop()!;
      params = {...params, ...route.params};
      stack.push(...route.children);
    }
    return params;
  }


  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.diaRetiroSeleccionado = event.value;  
  }



  confirmarRetiro(){

    if (this.cantidadPalletsSeleccionados == 0) {
      showNotification("Debe indicar el o los Pallets que desea retirar.");
      return;
    }

    if( this.diaRetiroSeleccionado == null ){
      showNotification("Debe indicar la fecha y hora del Retiro");
      return;
    }

    if(  this.datasourceTramosHoras.data.filter(x=>x.seleccionado == true).length == 0 ){
      showNotification("Debe indicar el tramo de horario para el Retiro");
      return;
    }

    let palletsARetirar:DetalledeUbicacionesDisp[] = this.datasourcePallets.data.filter(  p=>p.seleccionado==true && p.CodEstadoUbicacion=="002" );
    Swal.fire({
      title: "¿Desea cursar la solicitud para procesar el retiro?",
      icon: "question",
      allowOutsideClick: false,
      showCancelButton: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarRetiroPAllets(palletsARetirar);
      }
    });

  }

  procesarRetiroPAllets(listadoPallets:DetalledeUbicacionesDisp[]){

    Swal.fire({
      title: "Procesando información de Retiro",
      text:
        "Actualizando la información en nuestros sistemas, espere por favor.",
      icon: "info",
      allowOutsideClick: false,
    });
    Swal.showLoading();

    try {
      Swal.close();
      this.storageService.procesarRetiro( listadoPallets, this.datepipe.transform(this.diaRetiroSeleccionado, "yyyy-MM-dd") ,  this.numeroCaso, this.datasourceTramosHoras.data.filter(x=>x.seleccionado == true)).subscribe( (respuesta:any)=>{
        if( respuesta == false ){
          Swal.fire({
            title:'Error',
            icon:'error',
            allowOutsideClick:false,
            text:'Ha ocurrido un error al procesar la solicitud.'
          })
        }else{
          console.log(respuesta);
          this.router.navigate(['../'],{relativeTo:this.activatedRoute});
        }
      })

    } catch (error) {
      Swal.close();
      Swal.fire({
        title:'Error',
        icon:'error',
        allowOutsideClick:false,
        text:'Ha ocurrido un error al procesar la solicitud.'
      })
    }
  
  }

}
