import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { EstandardelaUbicacion, ReservaPosiciones, TipodeTarifa } from 'src/app/models/entidades.bizagi.models';
import { StorageService } from '../../services/storage.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import {cargarEstandar} from '../../services/store/actions/bizagi.actions';
import {cargarTarifa} from '../../services/store/actions/bizagi.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {SubSink} from 'subsink';
import * as uuid from 'uuid';


export interface DialogData {
  disponibleBase: number,
  disponibleMedia:number,
  disponibleMaxima:number,
  reserva?:any
}

export class ReservaPosicion{
  public cantidadRequerida:number=0;
  public estandar:EstandardelaUbicacion;
  public tarifa:TipodeTarifa;
  public observaciones:string;
  public id:string;
  constructor(){ 
    this.id=uuid.v4();
  }
}



@Component({
  selector: 'app-reserva-posiciones',
  templateUrl: './reserva-posiciones.component.html',
  styleUrls: ['./reserva-posiciones.component.css']
})
export class ReservaPosicionesComponent implements OnInit , OnDestroy{
  
  reservaPosicion:ReservaPosicion = new ReservaPosicion();
  ReservaPosicionesForm: FormGroup;
  listadoEstandar$:Observable<EstandardelaUbicacion[]>;
  listadoTarifa$:Observable<TipodeTarifa[]>;
  cantidadDisponible:number=0;

  currentTotalUbicaciones:number=0;
  currentEstandar:EstandardelaUbicacion;
  currentTarifa:TipodeTarifa;
  
  subs=new SubSink();
  
  constructor( 
     public dialogRef: MatDialogRef<ReservaPosicionesComponent>,
     private fb: FormBuilder,
     public storageService: StorageService,
     private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 

      this.dialogRef.disableClose=true;
      
    }
  
    
    ngOnInit(): void {
      
      this.ReservaPosicionesForm = this.fb.group({
        estandar:[  '',[Validators.required] ],
        tipoTarifa: ['', [Validators.required]],
        Cantidad: ['', [Validators.required, Validators.min(1)]],
        Observaciones: ['' ],
      });
      
      this.loadData();
      this.addListener();

      if( this.data.reserva != null ){
        this.poblarDatosReserva(this.data.reserva );
      }
    }

    poblarDatosReserva(reserva) {
      console.log('poblar reserva');
      this.reservaPosicion.id = reserva.id;
      //this.ReservaPosicionesForm.get('estandar').setValue( reserva.CodigodeEstandar );
      this.subs.sink = this.listadoEstandar$.subscribe(listadoEstandares=>{
        this.currentEstandar  = listadoEstandares.filter(e=>e._attributes.key==reserva.CodigodeEstandar )[0];
        this.ReservaPosicionesForm.get('estandar').setValue( this.currentEstandar.CodEstandar );
      
      
        this.listadoTarifa$= this.store.select('tarifa').pipe(
          map( estado=>{
              if(estado.loaded){
                let newListado:TipodeTarifa[] = estado.bizagiResponse.Entities.TipodeTarifa;
                return newListado.filter(  tarifa=>tarifa.Estandar.CodEstandar == this.currentEstandar.CodEstandar  );
              }
          } )
        )


        this.subs.sink = this.listadoTarifa$.subscribe( listadoTarifa =>{
          this.ReservaPosicionesForm.get('tipoTarifa').setValue( listadoTarifa.find(  t=>t._attributes.key== reserva.TipodeTarifa ).CodTipodeTarifa);
        } );

      });

      this.ReservaPosicionesForm.get('Observaciones').setValue(reserva.ObservacionesAdicionales);
      this.ReservaPosicionesForm.get('Cantidad').setValue(reserva.CantidadRequerida);

      this.subs.sink = this.listadoTarifa$.subscribe( response=>{
        this.currentTarifa=response.filter(t=>t.CodTipodeTarifa==reserva.TipodeTarifa )[0];
        this.getDisponibilidadUbicaciones();
      } );

    }

    addListener() {
      
      this.listadoEstandar$ = this.store.select('estandar').pipe(  
       map( estado=>{
          if( estado.loaded ){
            return estado.bizagiResponse.Entities.EstandardelaUbicacion;
          }
       } )
     )
 
    }

    getDisponibilidadUbicaciones():number{
      switch (this.currentEstandar?.CodEstandar) {
        case 'E1':{
          this.cantidadDisponible = this.data.disponibleBase;
          break;
        }
      
          case 'E2':{
            this.cantidadDisponible = this.data.disponibleMedia;
            break;
          }
          
          case 'E3':{
            this.cantidadDisponible = this.data.disponibleMaxima;
            break;
          }
      }
      this.ReservaPosicionesForm.get('Cantidad').setValidators(Validators.max(this.cantidadDisponible));
      this.ReservaPosicionesForm.get('Cantidad').updateValueAndValidity();
      return this.cantidadDisponible;
    }


    seleccionEstandar(valorEstandar):void{
      this.subs.sink = this.listadoEstandar$.subscribe(listadoEstandares=>{
        this.currentEstandar  = listadoEstandares.filter(e=>e.CodEstandar==valorEstandar)[0];
 
 
        this.listadoTarifa$= this.store.select('tarifa').pipe(
          map( estado=>{
              if(estado.loaded){
                let newListado:TipodeTarifa[] = estado.bizagiResponse.Entities.TipodeTarifa;
                if( newListado != null && newListado.length> 0 ){
                  return newListado.filter(  tarifa=>tarifa.Estandar?.CodEstandar == valorEstandar);
                }
                
              }
          } )
        )
      });
 


      this.getDisponibilidadUbicaciones();

    }


    seleccionTarifa(valor):void{
      console.log('valor tarifa:', valor);
      this.subs.sink=  this.listadoTarifa$.subscribe(  listadoTarifa=>{

         this.currentTarifa=listadoTarifa.filter(t=>t.CodTipodeTarifa==valor)[0];
 
      }  );
     
    }

    ngOnDestroy(): void {
      if(this.subs){
        this.subs.unsubscribe();
      }

  
    }

    loadData() {
      //this.store.dispatch(cargarEstandar());
      //this.store.dispatch(cargarTarifa());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick():void{
    console.log("cerrando dialogo reserva posiciones");
    if( this.ReservaPosicionesForm.invalid ) return;

     
    const {estandar, tipoTarifa,Cantidad,Observaciones} = this.ReservaPosicionesForm.value;
    this.reservaPosicion.cantidadRequerida = Cantidad;
    this.reservaPosicion.estandar = this.currentEstandar;
    this.reservaPosicion.tarifa = this.currentTarifa;
    this.reservaPosicion.observaciones = Observaciones;

   
    this.dialogRef.close()

  }

}
