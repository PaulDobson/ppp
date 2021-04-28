import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AppState } from "src/app/app.reducer";
import { AuthService } from "src/app/auth/services/auth.service";
import {
  BancodeCargo,
  ListadodeHorasDisponibles,
  ReservaPosiciones,
  TipodeCuenta,
  TipodePago,
  TramodeHoras,
  _casoControlAlmacenaje,
} from "src/app/models/entidades.bizagi.models";
import { StorageService } from "../services/storage.service";
import { MatDialog } from "@angular/material/dialog";
import { ReservaPosicionesComponent } from "../shared/reserva-posiciones/reserva-posiciones.component";
import {
  cargarEstandar,
  cargarFrecuenciaCobro,
  cargarParametrosSistema,
  cargarTarifa,
  cargarTramoHoras,
  PerformActivity,
} from "../services/store/actions/bizagi.actions";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
import { SubSink } from "Subsink";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";
import * as uuid from "uuid";
import { showNotification } from "../../services/helpers";
import { isLoading, stopLoading } from "src/app/shared/ui.actions";
import { EstandarInitialState } from "../services/store/reducers/bizagi.estandar.reducers";
import { cargarBanco } from "src/app/perfil/services/store/actions/bizagi.Banco.actions";
import { cargarTipoCuenta } from "src/app/perfil/services/store/actions/bizagi.Cuenta.actions";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new SubSink();

  habilitado: boolean = false;
  vistaMainPanel: boolean = true;
  fechaActualizacion: Date = new Date();

  disponibleBase: number = 0;
  disponibleMedia: number = 0;
  disponibleMaxima: number = 0;
  cantidadAcumuladaSeleccionadaBase: number = 0;
  cantidadAcumuladaSeleccionadaMedia: number = 0;
  cantidadAcumuladaSeleccionadaMaxima: number = 0;
  idEntityEmpresa: string;

  listadoTipoPago: TipodePago[] = [];
  listadoReservas: ReservaPosiciones[] = [];
  CasoEnCursoControlAlmacenaje: _casoControlAlmacenaje;
  listadoHoras: TramodeHoras[] = [];
  listadoParametros: [] = [];
  listadoBancos: BancodeCargo[] = [];
  listadoCuentas: TipodeCuenta[] = [];
  displayedColumnsTramoHoras: string[] = [
    "horaDisponible",
    "fechaIngreso",
    "reservar",
  ];
  displayedColumnsReserva: string[] = [
    "estandar",
    "tarifa",
    "cantidad",
    "observaciones",
    "acciones",
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  datasourceTramosHoras = new MatTableDataSource<TramodeHoras>();
  datasourceReservaPosiciones = new MatTableDataSource<ReservaPosiciones>();

  selectDiaPagoFormControl = new FormControl("", Validators.required);
  selectFrecPagoFormControl = new FormControl("", Validators.required);
  checkMaterialPeligrosoFormControl = new FormControl("", Validators.required);

  selectTipodeCuentaFormControl = new FormControl("", Validators.required);
  selectTipoPagoFormControl = new FormControl("", Validators.required);
  selectBancoFormControl = new FormControl("", Validators.required);
  NumerodeCuenta = new FormControl("", Validators.required);

  //NumerodeCuenta: ["", [Validators.required]],
  //Banco: ["", [Validators.required]],
  //TipodeCuenta: ["", [Validators.required]],

  minDateReserva: Date = new Date();
  diaDespachoSeleccionado: Date;

  posicionesReservadas: any[] = [];
  cantidadTramos: number = 0;
  loading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public storageService: StorageService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {}

  ngAfterViewInit(): void {
    this.datasourceTramosHoras.data = this.listadoHoras;
    this.datasourceReservaPosiciones.data = this.listadoReservas;
  }

  ngOnInit(): void {
    this.store.dispatch(isLoading());
    this.loadData();
    this.addListener();

    this.selectDiaPagoFormControl.registerOnChange((registro) => {
      if (registro) {
        this.diaDespachoSeleccionado = registro;
        this.calcularCantidadTramos();
      }
    });

    this.loading$ = this.store
      .select("ui")
      .pipe(map((estado) => estado.isLoading));

    this.minDateReserva.setDate(this.minDateReserva.getDate() + 1);
  }

  loadData(): void {
    this.store.dispatch(cargarBanco());
    this.store.dispatch(cargarTipoCuenta());

    this.store.dispatch(cargarEstandar());
    this.store.dispatch(cargarTarifa());

    this.store.dispatch(cargarFrecuenciaCobro());
    this.store.dispatch(cargarTramoHoras());

    //obtiene Empresa a la cual esta asociado el usuario
    this.authService.getEmpresaStorage();

    this.store.dispatch(cargarParametrosSistema());
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  calcularCantidadTramos() {
    let pCapacidad: any = this.listadoParametros.find(
      (p: any) => p.CodParametro == environment.id_cantidadMaximaIngreso
    );
    let capacidad: number = 50;
    if (pCapacidad != undefined || pCapacidad != null) {
      capacidad = pCapacidad.Valor;
    }
    let totalUbicaciones = this.getCantidadTotal();
    if (totalUbicaciones % capacidad == 0) {
      this.cantidadTramos = totalUbicaciones / capacidad;
    } else {
      this.cantidadTramos = Math.ceil(totalUbicaciones / capacidad);
    }
  }

  crearSolicitudIngreso(): void {
    this.storageService.prepararCreacionSolicitud(this.idEntityEmpresa);
    this.store.dispatch(isLoading());
  }

  addListener(): void {
    this.subs.sink = this.store.select("bancos").subscribe((response) => {
      if (response.loaded) {
        this.listadoBancos = [...response.bizagiResponse.Entities.BancodeCargo];
      }
    });

    this.subs.sink = this.store.select("tipoCuenta").subscribe((response) => {
      if (response.loaded) {
        this.listadoCuentas = [
          ...response.bizagiResponse.Entities.TipodeCuenta,
        ];
      }
    });

    this.subs.sink = this.store.select("parametros").subscribe((parametros) => {
      if (parametros.loaded) {
        let listadoParametros: [] =
          parametros.bizagiResponse.Entities.ParametrosSistema;
        if (listadoParametros != null && listadoParametros.length > 0) {
          this.listadoParametros = [...listadoParametros];
        }
      }
    });

    /**
     * DETECTA SI EL CASO SE HA CREADO, SI EXISTE, O NO.
     */
    this.subs.sink = this.store
      .select("registroSolicitud")
      .subscribe((estado) => {
        if (estado.loading) {
          this.store.dispatch(isLoading());
        } else if (estado.loaded) {
          this.store.dispatch(stopLoading());

          //Si el objeto que viene dentro de entities es proccess, quier decir que se acaba de crear.
          if (
            estado.bizagiResponse.processes != null &&
            estado.bizagiResponse.processes != undefined
          ) {
            if (this.idEntityEmpresa != null && this.idEntityEmpresa != "") {
              this.storageService.getCasosPendientes(
                this.idEntityEmpresa,
                "True"
              );
            }
          } else {
            if (estado.loaded && estado.error == null) {
              this.store.dispatch(stopLoading());
              if (
                estado.bizagiResponse.Entities != null &&
                estado.bizagiResponse.Entities.ControlDeAlmacenaje != null
              ) {
                if (
                  estado.bizagiResponse.Entities.ControlDeAlmacenaje
                    .EnCompletarRegistro == "True"
                ) {
                  this.poblarRegistroSolicitud(
                    estado.bizagiResponse.Entities.ControlDeAlmacenaje
                  );
                } else {
                  this.vistaMainPanel = true;
                }
              } else {
                this.vistaMainPanel = true;
              }
            }
          }
        }
      });

    this.subs.sink = this.store.select("actualizarcaso").subscribe((estado) => {
      if (estado.loading) {
        Swal.fire({
          title: "Actualización de Reserva de posiciones",
          text:
            "Actualizando la información en nuestros sistemas, espere por favor.",
          icon: "info",
          allowOutsideClick: false,
        });
        Swal.showLoading();
      } else if (estado.loaded) {
        if (
          estado.bizagiResponse.Entities != null &&
          estado.bizagiResponse.Entities.ControlDeAlmacenaje != null
        ) {
          this.store.dispatch(
            PerformActivity({
              idCase: this.CasoEnCursoControlAlmacenaje.NumerodeCaso,
              taskName: environment.taskIDCompletarRegistro,
            })
          );
        }
      } else if (estado.error) {
        console.log(estado.error);
        Swal.close();
      }
    });

    /**
     * PerformActivity: Escucha el resultado de la operacion
     */
    this.subs.sink = this.store
      .select("performRegistro")
      .subscribe((estado) => {
        if (estado.loaded) {
          this.store.dispatch(stopLoading());
          Swal.close();
          let procceses = estado.bizagiResponse.processes;
          if (
            procceses != null &&
            procceses != undefined &&
            procceses.process != undefined
          ) {
            //pregunta si la respuesta tiene el tag Error
            if (
              procceses.process.processError != null &&
              procceses.process.processError != undefined &&
              procceses.process.processError.errorCode == ""
            ) {
              this.storageService.getCasosPendientes(
                this.idEntityEmpresa,
                "True"
              );
              Swal.fire({
                title: "Actualización de Reserva de posiciones",
                icon: "success",
                timer: 2000,
                text: `Solicitud ${this.CasoEnCursoControlAlmacenaje.NumerodeCaso} procesada exitosamente.`,
              });
              //showNotification('La solicitud se ha registrado exitosamente');
            } else {
              showNotification(procceses.process.processError.errorMessage);
            }
          }

          console.log(estado.bizagiResponse);
        }
      });

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
    this.subs.sink = this.store.select("empresa").subscribe(({ empresa }) => {
      if (empresa) {
        this.store.dispatch(isLoading());
        this.idEntityEmpresa = empresa.id;

        /**
         * UNA VEZ QUE SE OBTIENE EL ID DE EMPRESA, SE GATILLA CONSULTA PARA VER SI HAY CASOS PENDIENTES DE FINALIZAR
         */
        this.storageService.getCasosPendientes(this.idEntityEmpresa, "True");
      }
    });

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
        }),
        tap((listado) => {
          let diaSeleccionado = this.datepipe.transform(
            this.diaDespachoSeleccionado,
            "ddMMyyyy"
          );
          let diaActual = this.datepipe.transform(Date.now(), "ddMMyyyy");
          if (diaSeleccionado === diaActual) {
            var horaActual = Number.parseInt(
              this.datepipe.transform(Date.now(), "HH")
            );

            listado.forEach((tram) => {
              try {
                let horaInicialTramo = Number.parseInt(
                  tram.Tramo.split(":")[0]
                );
                if (horaActual >= horaInicialTramo) {
                  tram.activo = false;
                }
              } catch (error) {}
            });
          }
        })
      )
      .subscribe((listado) => {
        if (listado) {
          this.listadoHoras = [...listado];

          this.datasourceTramosHoras.data = [...this.listadoHoras];
        }
      });

    /**
     * FRECUENCIA COBRO
     */
    this.cargarFrecuenciaCobro();

    this.subs.sink = this.store.select("ubicaciones").subscribe((response) => {
      if (response.loaded && response.error == null) {
        if (response.bizagiResponse.Entities != "") {
          this.poblarUbicaciones(
            response.bizagiResponse.Entities.NewUbicaciones
          );
        }
      }
    });
  }

  cargarFrecuenciaCobro() {
    this.subs.sink = this.store
      .select("frecuenciaCobro")
      .subscribe((estado) => {
        if (estado.loaded && estado.error == null) {
          this.listadoTipoPago = [...estado.bizagiResponse.Entities.TipodePago];
        }
      });
  }

  poblarRegistroSolicitud(ControlDeAlmacenaje: any) {
    if (Array.isArray(ControlDeAlmacenaje) && ControlDeAlmacenaje.length > 0) {
      this.CasoEnCursoControlAlmacenaje =
        ControlDeAlmacenaje[ControlDeAlmacenaje.length - 1];

      this.vistaMainPanel = false;
    } else {
      this.CasoEnCursoControlAlmacenaje = ControlDeAlmacenaje;
      this.vistaMainPanel = false;
    }

    //reserva de posiciones
    if (this.CasoEnCursoControlAlmacenaje.ReservadePosiciones != null) {
      let reservaPosicionesBizagi: ReservaPosiciones[] = [];
      if (
        Array.isArray(
          this.CasoEnCursoControlAlmacenaje.ReservadePosiciones
            .ReservadePosiciones
        )
      ) {
        reservaPosicionesBizagi = this.CasoEnCursoControlAlmacenaje
          .ReservadePosiciones.ReservadePosiciones;
      } else {
        reservaPosicionesBizagi.push(
          this.CasoEnCursoControlAlmacenaje.ReservadePosiciones
            .ReservadePosiciones
        );
      }

      reservaPosicionesBizagi.forEach((reserva: any) => {
        let reservaPosicion: ReservaPosiciones = { ...reserva };
        reservaPosicion.id = uuid.v4();
        reservaPosicion.CantidadRequerida = Number.parseInt(
          reserva.CantidadRequerida
        );
        reservaPosicion.CodigodeEstandar = Number.parseInt(
          reserva.CodigodeEstandar
        );
        reservaPosicion.TipodeTarifa = Number.parseInt(reserva.TipodeTarifa);
        reservaPosicion.ControlDeAlmacenaje = Number.parseInt(
          reserva.ControlDeAlmacenaje
        );
        reservaPosicion.Standar = Number.parseInt(reserva.CodigodeEstandar);

        this.subs.sink = this.store.select("estandar").subscribe((estado) => {
          if (estado.loaded) {
            let currentEstandar = estado.bizagiResponse.Entities.EstandardelaUbicacion.filter(
              (x) => x._attributes.key == reservaPosicion.CodigodeEstandar
            )[0];
            if (currentEstandar) {
              reservaPosicion.DescStandar = currentEstandar.DescEstandar;

              this.subs.sink = this.store
                .select("tarifa")
                .subscribe((tarifa) => {
                  if (tarifa.loaded) {
                    let CurrentTrifa = tarifa.bizagiResponse.Entities.TipodeTarifa.filter(
                      (t) => t._attributes.key == reserva.TipodeTarifa
                    )[0];
                    reservaPosicion.DescTipoTarifa =
                      CurrentTrifa?.DescTipodeTarifa;
                  }
                });
            }
          }
        });

        this.listadoReservas.push(reservaPosicion);
      });

      this.datasourceReservaPosiciones.data = [...this.listadoReservas];
      this.calcularPosicionesDisponibles();
      this.calcularCantidadTramos();
    }

    //ubicaciones disponibles
    this.CasoEnCursoControlAlmacenaje.UbicacionesDisponiblespo.UbicacionesDisponiblespo.forEach(
      (ubicacion) => {
        if (ubicacion.Estandar == "1") {
          this.disponibleBase = Number.parseInt(ubicacion.CantidadDisponible);
        } else if (ubicacion.Estandar == "2") {
          this.disponibleMedia = Number.parseInt(ubicacion.CantidadDisponible);
        } else if (ubicacion.Estandar == "3") {
          this.disponibleMaxima = Number.parseInt(ubicacion.CantidadDisponible);
        }
      }
    );

    //tramo de cobro
    if (
      this.CasoEnCursoControlAlmacenaje.FrecuenciadeCobro != null ||
      this.CasoEnCursoControlAlmacenaje.FrecuenciadeCobro != undefined
    ) {
      this.subs.sink = this.store
        .select("frecuenciaCobro")
        .subscribe((estado) => {
          if (estado.loaded) {
            this.selectFrecPagoFormControl.setValue(
              this.CasoEnCursoControlAlmacenaje.FrecuenciadeCobro.CodFrecuencia
            );
          }
        });
    }

    //material peligroso
    if (
      this.CasoEnCursoControlAlmacenaje.DeclaraquenocontieneM != null ||
      this.CasoEnCursoControlAlmacenaje.DeclaraquenocontieneM != undefined
    ) {
      this.checkMaterialPeligrosoFormControl.setValue(
        this.CasoEnCursoControlAlmacenaje.DeclaraquenocontieneM == "True"
          ? "1"
          : "0"
      );
    }

    this.selectDiaPagoFormControl.setValue(
      this.CasoEnCursoControlAlmacenaje.FechaHoraIngreso,
      { emitEvent: true }
    );

    if (this.CasoEnCursoControlAlmacenaje.ListadodeHorasDisponibl != null) {
      var listadoHorasSeleccionadas: ListadodeHorasDisponibles[] = [];
      if (
        Array.isArray(
          this.CasoEnCursoControlAlmacenaje.ListadodeHorasDisponibl
            .ListadodeHorasDisponibles
        )
      ) {
        listadoHorasSeleccionadas = this.CasoEnCursoControlAlmacenaje
          .ListadodeHorasDisponibl.ListadodeHorasDisponibles;
      } else {
        listadoHorasSeleccionadas.push(
          this.CasoEnCursoControlAlmacenaje.ListadodeHorasDisponibl
            .ListadodeHorasDisponibles
        );
      }

      if (listadoHorasSeleccionadas != null) {
        listadoHorasSeleccionadas.forEach((hora) => {
          let horario = this.listadoHoras.filter(
            (h) => h.CodigoTramo == hora.Tramosdisponibles
          );
          if (horario != null) {
            horario[0].seleccionado = true;
          }
        });
      }
    }
  }

  //Evento que procesa seleccion desde MatDialog dia despacho
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.diaDespachoSeleccionado = event.value;
  }

  confirmarReserva(): void {
    /**
     * VALIDACIONES
     */
    if (this.datasourceReservaPosiciones.data.length == 0) {
      showNotification("Debe indicar las posiciones que desea reservar");
      return;
    }
    let tramosSeleccionados = this.datasourceTramosHoras.data.filter(
      (t) => t.seleccionado == true
    ).length;
    if (tramosSeleccionados == 0) {
      showNotification(
        "Debe indicar el horario en el cual realizará la entrega"
      );
      return;
    }

    if (tramosSeleccionados < this.cantidadTramos) {
      showNotification(
        `Le falta seleccionar ${
          this.cantidadTramos - tramosSeleccionados
        } tramo(s) para asegurar la disponibilidad horaria de sus reservas`
      );
      return;
    }

    if (this.checkMaterialPeligrosoFormControl.invalid) {
      showNotification(`Debe declarar si contiene material peligroso.`);
      return;
    }

    if (this.selectBancoFormControl.invalid) {
      showNotification(`Debe seleccionar el Banco`);
      return;
    }

    if (this.selectTipoPagoFormControl.invalid) {
      showNotification(`Debe seleccionar el Tipo de Pago`);
      return;
    }

    if (this.selectTipodeCuentaFormControl.invalid) {
      showNotification(`Debe seleccionar el Tipo de Cuenta`);
      return;
    }

    if (this.NumerodeCuenta.invalid) {
      showNotification(`Debe ingresar el número de la cuenta.`);
      return;
    }

    Swal.fire({
      title: "¿Desea cursar la solicitud para procesar la recepción?",
      icon: "question",
      allowOutsideClick: false,
      showCancelButton: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarActualizacionCasoPerformActivity();
      }
    });
  }

  private procesarActualizacionCasoPerformActivity() {
    let banco = this.selectBancoFormControl.value;
    let tipoPago = this.selectTipoPagoFormControl.value;
    let tipoCuenta = this.selectTipodeCuentaFormControl.value;
    let numCuenta = this.NumerodeCuenta.value;

    this.storageService.actualizarCasoRecepcion(
      this.datasourceReservaPosiciones.data,
      this.datasourceTramosHoras.data.filter((x) => x.seleccionado),
      this.checkMaterialPeligrosoFormControl.value,
      this.CasoEnCursoControlAlmacenaje._attributes.key,
      this.datepipe.transform(this.diaDespachoSeleccionado, "yyyy-MM-dd"),
      banco,
      tipoPago,
      tipoCuenta,
      numCuenta
    );
  }

  //valida si la cantidad de tramos seleccionados cumple con la requerida
  changeChecbox(tramo, evento): void {
    tramo.seleccionado = evento;
    let totalSeleccionados = this.datasourceTramosHoras.data.filter(
      (t) => t.seleccionado == true
    ).length;

    if (totalSeleccionados == this.cantidadTramos) {
      let tramosRestantes: TramodeHoras[] = this.datasourceTramosHoras.data.filter(
        (t) => t.seleccionado == false
      );
      tramosRestantes.forEach((x) => (x.activo = false));
    } else {
      this.datasourceTramosHoras.data.forEach((x) => (x.activo = true));
    }
  }

  /**
   *
   * CUADROS DE DIALOGO EDITAR Y CREAR POSICION
   */
  showReservaPosicion(): void {
    const dialogRef = this.dialog.open(ReservaPosicionesComponent, {
      width: "50%",
      disableClose: true,
      data: {
        disponibleBase:
          this.disponibleBase - this.cantidadAcumuladaSeleccionadaBase,
        disponibleMedia:
          this.disponibleMedia - this.cantidadAcumuladaSeleccionadaMedia,
        disponibleMaxima:
          this.disponibleMaxima - this.cantidadAcumuladaSeleccionadaMaxima,
      },
    });

    this.subs.sink = dialogRef.beforeClosed().subscribe((resultado) => {
      if (resultado != null) {
        this.populateReservaPosicionFromDialog(resultado);
        this.calcularPosicionesDisponibles();
        this.calcularCantidadTramos();
      }
    });
  }

  editarReserva(reserva): void {
    const dialogRef = this.dialog.open(ReservaPosicionesComponent, {
      width: "50%",
      disableClose: true,
      data: {
        disponibleBase:
          this.disponibleBase - this.cantidadAcumuladaSeleccionadaBase,
        disponibleMedia:
          this.disponibleMedia - this.cantidadAcumuladaSeleccionadaMedia,
        disponibleMaxima:
          this.disponibleMaxima - this.cantidadAcumuladaSeleccionadaMaxima,
        reserva: reserva,
      },
    });

    this.subs.sink = dialogRef.beforeClosed().subscribe((resultado) => {
      if (resultado != null) {
        this.populateReservaPosicionFromDialog(resultado);
        this.calcularPosicionesDisponibles();
        this.calcularCantidadTramos();
      }
    });
  }

  populateReservaPosicionFromDialog(resultado: any) {
    let objeto: ReservaPosiciones = {
      ControlDeAlmacenaje: Number.parseInt(
        this.CasoEnCursoControlAlmacenaje._attributes.key
      ),
      CantidadRequerida: resultado.cantidadRequerida,
      CodigodeEstandar: resultado.estandar._attributes.key,
      DescStandar: resultado.estandar.DescEstandar,
      ObservacionesAdicionales: resultado.observaciones,
      TipodeTarifa: resultado.tarifa._attributes.key,
      DescTipoTarifa: resultado.tarifa.DescTipodeTarifa,
      Standar: resultado.estandar._attributes.key,
      id: resultado.id,
    };

    let reservaActualizar = this.listadoReservas.find(
      (reserva) => reserva.id === objeto.id
    );
    if (reservaActualizar == null || reservaActualizar == undefined) {
      this.listadoReservas.push(objeto);
    } else {
      let index = this.listadoReservas.indexOf(reservaActualizar);
      this.listadoReservas[index] = objeto;
    }

    this.datasourceReservaPosiciones.data = [...this.listadoReservas];
  }

  eliminarReserva(reserva): void {
    Swal.fire({
      title: "¿Desea eliminar esta reserva?",
      showConfirmButton: true,
      showCancelButton: true,
    }).then((opcion) => {
      if (opcion.isConfirmed) {
        let reservaAEliminar = this.listadoReservas.find(
          (reserva) => reserva.id === reserva.id
        );
        let index = this.listadoReservas.indexOf(reservaAEliminar);
        this.listadoReservas.splice(index, 1);
        this.datasourceReservaPosiciones.data = [...this.listadoReservas];
      }
    });
  }

  poblarUbicaciones(ubicacionesReservadas: any) {
    if (
      Array.isArray(ubicacionesReservadas) &&
      ubicacionesReservadas.length > 0
    ) {
      //hay posiciones reservadas se debe filtrar la tabla de tramo de horas.
      console.log(
        "existen posiciones reservadas para la fecha: " +
          this.diaDespachoSeleccionado
      );
      ubicacionesReservadas?.forEach((posicion) => {
        this.posicionesReservadas.push(posicion);
      });
    } else {
      console.log(
        "no hay posiciones resservadas para dia: " +
          this.diaDespachoSeleccionado
      );
    }
  }

  getCantidadTotal() {
    return this.listadoReservas
      .map((t) => t.CantidadRequerida)
      .reduce((cant, value) => cant + value, 0);
  }

  calcularPosicionesDisponibles() {
    this.cantidadAcumuladaSeleccionadaBase = this.listadoReservas
      .filter((x) => x.Standar == 1)
      .map((t) => t.CantidadRequerida)
      .reduce((cant, value) => cant + value, 0);
    this.cantidadAcumuladaSeleccionadaMedia = this.listadoReservas
      .filter((x) => x.Standar == 2)
      .map((t) => t.CantidadRequerida)
      .reduce((cant, value) => cant + value, 0);
    this.cantidadAcumuladaSeleccionadaMaxima = this.listadoReservas
      .filter((x) => x.Standar == 3)
      .map((t) => t.CantidadRequerida)
      .reduce((cant, value) => cant + value, 0);
  }
}
