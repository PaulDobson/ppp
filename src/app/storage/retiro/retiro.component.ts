import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/app.reducer";
import { AuthService } from "src/app/auth/services/auth.service";
import { TramodeHoras, _casoControlAlmacenaje } from "src/app/models/entidades.bizagi.models";
import { isLoading, stopLoading } from "src/app/shared/ui.actions";
import { SubSink } from "Subsink";
import { StorageService } from "../services/storage.service";

@Component({
  selector: "app-retiro",
  templateUrl: "./retiro.component.html",
  styleUrls: ["./retiro.component.css"],
})
export class RetiroComponent implements OnInit, AfterViewInit, OnDestroy {
  subs = new SubSink();
  habilitado: boolean = false;
  loading$: Observable<boolean>;
  idEntityEmpresa: string;
  listadoHoras: TramodeHoras[] = [];
  listadoCasosDisponibleRetiro:_casoControlAlmacenaje[]=[];
  visualizarDetalle:boolean=false;

  displayedColumnsCasos: string[] = [
    "caso",
    "FechaHoraIngreso",
    "cantidad_inicial",
    "observaciones",
    "acciones"
  ];

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  datasourceCasosDisponibles = new MatTableDataSource<_casoControlAlmacenaje>();

  constructor(
    public authService: AuthService,
    public storageService: StorageService,
    private store: Store<AppState>,
    public datepipe: DatePipe,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) {
    this.visualizarDetalle = false;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {
    this.datasourceCasosDisponibles.data = this.listadoCasosDisponibleRetiro;
    this.datasourceCasosDisponibles.paginator = this.paginator;
    if (this.activatedRoute.firstChild != null) {
      this.visualizarDetalle = true;
    }
  }

  ngOnInit(): void {
    this.store.dispatch(isLoading());
    this.loadData();
    this.addListener();
  }

  loadData() {
    //obtiene Empresa a la cual esta asociado el usuario
    this.authService.getEmpresaStorage();
  }

  addListener() {
    /**
     * Flag Loading
     */
    this.loading$ = this.store
      .select("ui")
      .pipe(map((estado) => estado.isLoading));

    /**
     * USUARIO
     */
    this.subs.sink = this.store.select("user").subscribe((usuario) => {
      if (usuario && usuario.user) {
        if (usuario.user.habilitado) {
          this.habilitado = true;
        } else {
          this.habilitado = false;
        }
        this.store.dispatch(stopLoading());
      }
    });

    /**
     * EMPRESA
     */
    /*
    this.subs.sink = this.store.select("empresa").subscribe(({ empresa }) => {
      if (empresa) {
        this.store.dispatch(isLoading());
        if( this.idEntityEmpresa == null ){

          this.idEntityEmpresa = empresa.id;
          if( this.idEntityEmpresa  )
          console.log("obtiene listado de casos ");
          this.storageService.getCasosDisponibleParaRetiro(this.idEntityEmpresa, "True");
        
        }
  
      }
    });*/

    if( this.idEntityEmpresa == null ){
      this.store.dispatch(isLoading());
      this.subs.sink = this.store.select("empresa").subscribe(({ empresa }) => {
        if (empresa) {
          this.store.dispatch(stopLoading());
          if( this.idEntityEmpresa == null ){

            this.idEntityEmpresa = empresa.id;
            console.log("obtiene listado de casos ");
            this.storageService.getCasosDisponibleParaRetiro(this.idEntityEmpresa, "True");
          }
        }
      });
    }

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
        }
      });


      /**
       * LISTADO DE CASOS DEL USUARIO
       */
      this.subs.sink = this.store.select('registroSolicitud').subscribe( estado =>{
        if( estado.loading ){
          this.store.dispatch(isLoading());
        }else if(  estado.loaded ){
          this.store.dispatch(stopLoading());
          if( estado.bizagiResponse.Entities.ControlDeAlmacenaje != null ){
            this.poblarListadoCasos( estado.bizagiResponse.Entities.ControlDeAlmacenaje );
          }
        }else if( estado.error ){
          this.store.dispatch(stopLoading());
        }
      } );
  }

  poblarListadoCasos(ControlDeAlmacenaje:any) {
    var casosDisponibles:_casoControlAlmacenaje[]=[];
    if( Array.isArray( ControlDeAlmacenaje ) ){
      casosDisponibles = ControlDeAlmacenaje;
    }else{
      casosDisponibles.push( ControlDeAlmacenaje );
    }

    this.listadoCasosDisponibleRetiro = casosDisponibles;
    this.datasourceCasosDisponibles.data = [...this.listadoCasosDisponibleRetiro];
     
  }

  getTotalPallets(caso){
    if( Array.isArray( caso.ReservadePosiciones.ReservadePosiciones ) ){
      var total:number=0;
      caso.ReservadePosiciones.ReservadePosiciones.forEach( x=>{
        total += Number.parseInt( x.CantidadRequerida);
      }
      );
      return total;
    }else{
      return caso.ReservadePosiciones.ReservadePosiciones.CantidadRequerida;
    }
  }

  ngOnDestroy(): void {
    
    console.log("ngOnDestroy RetiroComponent");
      this.subs.unsubscribe();
    
  }


}
