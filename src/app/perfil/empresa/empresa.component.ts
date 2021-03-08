import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/app.reducer";
import { AuthService } from "src/app/auth/services/auth.service";
import { CasoBizagi } from "src/app/models/casoBizgi.model";
import {
  BancodeCargo,
  Comuna,
  Provincia,
  Region,
  TipodeCuenta,
} from "src/app/models/entidades.bizagi.models";
import { BizagiService } from "src/app/services/bizagi.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { RegistrarPerfilService } from "../services/registrar-perfil.service";
import { cargarBanco } from "../services/store/actions/bizagi.Banco.actions";
import { cargarComunas } from "../services/store/actions/bizagi.comuna.actions";
import { cargarTipoCuenta } from "../services/store/actions/bizagi.Cuenta.actions";
import { cargarProvincia } from "../services/store/actions/bizagi.provincia.actions";

import { cargarRegion } from "../services/store/actions/bizagi.region.actions";

@Component({
  selector: "app-empresa",
  templateUrl: "./empresa.component.html",
  styleUrls: ["./empresa.component.css"],
})
export class EmpresaComponent implements OnInit, AfterViewInit, OnDestroy {
  perfilGroup: FormGroup;
  listadoBancos: BancodeCargo[] = [];
  listadoCuentas: TipodeCuenta[] = [];
  listadoRegiones: Region[] = [];
  listadoProvincias: Provincia[] = [];
  listadoComuna: Comuna[] = [];
  crearCaso: boolean = true;

  _subsComuna: Subscription;
  _subsRegion: Subscription;
  _subsProvincia: Subscription;
  _subsBanco: Subscription;
  _subsCuenta: Subscription;
  _subsEmpresa: Subscription;
  _subsCrearCaso: Subscription;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public bizagiService: BizagiService,
    private store: Store<AppState>
  ) {}
  
  ngOnDestroy(): void {
    if (this._subsComuna) {
      this._subsComuna.unsubscribe();
    }

    if (this._subsRegion) {
      this._subsRegion.unsubscribe();
    }

    if (this._subsProvincia) {
      this._subsProvincia.unsubscribe();
    }

    if (this._subsBanco) {
      this._subsBanco.unsubscribe();
    }

    if (this._subsCuenta) {
      this._subsCuenta.unsubscribe();
    }

    if (this._subsEmpresa) {
      this._subsEmpresa.unsubscribe();
    }

    if (this._subsCrearCaso) {
      this._subsCrearCaso.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.perfilGroup = this.fb.group({
      CorreoElectronicoEmpresa: ["", [Validators.required, Validators.email]],
      TelefonoFijooMovilCont: [
        "",
        [Validators.required, Validators.pattern(/^(\d{9}$)/)],
      ],
      NombreoRazonSocial: [
        "",
        [Validators.required, Validators.pattern("[a-zA-ZñÑ s0-9]{2,50}")],
      ],
      CorreoContactoComercial: ["", [Validators.required, Validators.email]],
      NombreContactoPrincipal: [
        "",
        [Validators.required, Validators.pattern("[a-zA-ZñÑ ]*")],
      ],
      DireccionComercial: [
        "",
        [
          Validators.required,
          Validators.pattern("^.*(?=.*[0-9])(?=.*[a-zA-ZñÑs]).*$"),
        ],
      ],
      NumerodeCuenta: ["", [Validators.required]],
      RutEmpresa: [
        "",
        [Validators.required, Validators.pattern(/^(\d{8}-)([kK]{1}$|\d{1}$)/)],
      ],
      Region: ["", [Validators.required]],
      Provincia: ["", [Validators.required]],
      Comuna: ["", [Validators.required]],
      Banco: ["", [Validators.required]],
      TipodeCuenta: ["", [Validators.required]],
      TelefonoFijooMovil: [
        "",
        [Validators.required, Validators.pattern(/^(\d{9}$)/)],
      ],
    });

    this.store.dispatch(cargarRegion());
    this.store.dispatch(cargarProvincia());
    this.store.dispatch(cargarComunas());
    this.store.dispatch(cargarBanco());
    this.store.dispatch(cargarTipoCuenta());

    this._subsBanco = this.store.select("bancos").subscribe((response) => {
      if (response.loaded) {
        this.listadoBancos = [...response.bizagiResponse.Entities.BancodeCargo];
      }
    });

    this._subsCuenta = this.store.select("tipoCuenta").subscribe((response) => {
      if (response.loaded) {
        this.listadoCuentas = [
          ...response.bizagiResponse.Entities.TipodeCuenta,
        ];
      }
    });

    this._subsRegion = this.store.select("regiones").subscribe((response) => {
      if (response.loaded) {
        this.listadoRegiones = [...response.bizagiResponse.Entities.Region];
      }
    });
  }

  ngAfterViewInit(): void {
    this.authService.getEmpresaStorage();

    this._subsEmpresa = this.store.select("empresa").subscribe((response) => {
      if (response) {
        this.crearCaso = false;

        this.perfilGroup
          .get("RutEmpresa")
          .setValue(response.empresa.RutEmpresa);
        this.perfilGroup.get("RutEmpresa").disable({ onlySelf: true });
        this.perfilGroup
          .get("CorreoElectronicoEmpresa")
          .setValue(response.empresa.CorreoElectronicoEmpresa);
        this.perfilGroup
          .get("TelefonoFijooMovilCont")
          .setValue(response.empresa.TelefonoFijooMovilCont);
        this.perfilGroup
          .get("NombreoRazonSocial")
          .setValue(response.empresa.NombreoRazonSocial);
        this.perfilGroup
          .get("CorreoContactoComercial")
          .setValue(response.empresa.CorreoContactoComercial);
        this.perfilGroup
          .get("NombreContactoPrincipal")
          .setValue(response.empresa.NombreContactoPrincipal);
        this.perfilGroup
          .get("DireccionComercial")
          .setValue(response.empresa.DireccionComercial);
        this.perfilGroup
          .get("NumerodeCuenta")
          .setValue(response.empresa.NumerodeCuenta);
        this.perfilGroup
          .get("TelefonoFijooMovil")
          .setValue(response.empresa.TelefonoFijooMovil);
        this.perfilGroup.get("Banco").setValue(response.empresa.CodBanco);
        this.perfilGroup
          .get("TipodeCuenta")
          .setValue(response.empresa.CodTipodeCuenta);

        if (
          response.empresa.Provincia != undefined &&
          response.empresa.Provincia != ""
        ) {
          console.log(
            "consultano por id Region que tiene la provincia informada"
          );
          this._subsProvincia = this.store
            .select("provincias")
            .pipe(
              map((provinciaState) => {
                if (provinciaState.loaded) {
                  if (
                    Array.isArray(
                      provinciaState.bizagiResponse.Entities.Provincia
                    )
                  ) {
                    let listProv: any[] =
                      provinciaState.bizagiResponse.Entities.Provincia;
                    return listProv.filter(
                      (x) => x._attributes.key == response.empresa.Provincia
                    );
                  } else {
                    if (
                      provinciaState.bizagiResponse.Entities.Provincia.id ==
                      response.empresa.Provincia
                    ) {
                      let listProv: Provincia[] = [];
                      listProv.push(
                        provinciaState.bizagiResponse.Entities.Provincia
                      );
                      return listProv;
                    }
                  }
                }
              })
            )
            .subscribe((provincias) => {
              if (provincias && provincias.length > 0) {
                this.listadoProvincias = [...provincias];
                this.RegionCmb.setValue(
                  this.listadoProvincias[0].Region.CodRegion
                );
                this.perfilGroup
                  .get("Provincia")
                  .setValue(this.listadoProvincias[0].CodProvincia);

                this._subsComuna = this.store
                  .select("comunas")
                  .pipe(
                    map((comunas) => {
                      if (comunas.loaded) {
                        if (
                          Array.isArray(comunas.bizagiResponse.Entities.Comuna)
                        ) {
                          let listComuna: Comuna[] =
                            comunas.bizagiResponse.Entities.Comuna;
                          return listComuna.filter(
                            (x) =>
                              x.Provincia.CodProvincia ==
                              this.listadoProvincias[0].CodProvincia
                          );
                        } else {
                          if (
                            comunas.bizagiResponse.Entities.Comuna.Provincia
                              .CodProvincia ==
                            this.listadoProvincias[0].CodProvincia
                          ) {
                            let listComuna: Comuna[] = [];
                            listComuna.push(
                              comunas.bizagiResponse.Entities.Comuna
                            );

                            return listComuna;
                          }
                        }
                      }
                    })
                  )
                  .subscribe((comunas) => {
                    if (comunas && comunas.length > 0) {
                      this.listadoComuna = [...comunas];
                      this.perfilGroup
                        .get("Comuna")
                        .setValue(response.empresa.CodComuna);
                    }
                  });
              }
            });
        }
      }
    });
  }

  seleccionRegion() {
    let valor = this.RegionCmb.value;
    this._subsProvincia = this.store
      .select("provincias")
      .pipe(
        map((provincias) => {
          if (provincias.loaded) {
            if (Array.isArray(provincias.bizagiResponse.Entities.Provincia)) {
              let listProv: Provincia[] =
                provincias.bizagiResponse.Entities.Provincia;
              return listProv.filter((x) => x.Region.CodRegion == valor);
            } else {
              if (
                provincias.bizagiResponse.Entities.Provincia.Region.CodRegion ==
                valor
              ) {
                let listProv: Provincia[] = [];
                listProv.push(provincias.bizagiResponse.Entities.Provincia);
                return listProv;
              }
            }
          }
        })
      )
      .subscribe((provincias) => {
        if (provincias) {
          this.listadoProvincias = [...provincias];
        }
      });
  }

  seleccionProvincia() {
    let valor = this.ProvinciaCmb.value;

    this._subsComuna = this.store
      .select("comunas")
      .pipe(
        map((comunas) => {
          if (comunas.loaded) {
            if (Array.isArray(comunas.bizagiResponse.Entities.Comuna)) {
              let listComuna: Comuna[] = comunas.bizagiResponse.Entities.Comuna;
              return listComuna.filter(
                (x) => x.Provincia.CodProvincia == valor
              );
            } else {
              if (
                comunas.bizagiResponse.Entities.Comuna.Provincia.CodProvincia ==
                valor
              ) {
                let listComuna: Comuna[] = [];
                listComuna.push(comunas.bizagiResponse.Entities.Comuna);
                return listComuna;
              }
            }
          }
        })
      )
      .subscribe((comunas) => {
        this.listadoComuna = [...comunas];
      });
  }

  get RegionCmb() {
    return this.perfilGroup.get("Region");
  }

  get ProvinciaCmb() {
    return this.perfilGroup.get("Provincia");
  }

  get RutEmpresaTxt() {
    return this.perfilGroup.get("RutEmpresa");
  }

  getMensajeError;

  buscarEmpresa() {
    if (this.RutEmpresaTxt.valid) {
      let rut = this.RutEmpresaTxt.value;
      var filters = `RutEmpresa='${rut}' `;
      this._subsEmpresa = this.bizagiService
        .getEntities("Cliente", filters)
        .subscribe((resp) => {
          if (resp.Entities != null && resp.Entities != "") {
            this.RutEmpresaTxt.setErrors({ notUnique: true });
          }
        });
    }
  }

  getRutEmpresaErrorMessage() {
    if (this.RutEmpresaTxt.hasError("notUnique")) {
      return "Esta empresa ya esta registrada en nuestros sistemas.";
    }
    return this.RutEmpresaTxt.hasError("pattern")
      ? "Formato de Rut Inválido debe ser: XXXXXXXX-X (Si es menor a 10 millones, anteponer 0)"
      : "";
  }

  UpdateEmpresa() {
    if (this.crearCaso) {
      this.CrearEmpresa();
    } else {
      this.ActualizarDatosEmpresa();
    }
  }

  ActualizarDatosEmpresa() {}
  CrearEmpresa() {
    if (this.perfilGroup.invalid) {
      return;
    }

    var casoBizagi: CasoBizagi = new CasoBizagi();
    casoBizagi.userName = environment.usuario_creador_caso;
    casoBizagi.domain = environment.domain;
    casoBizagi.Process = "Enrolamiento";

    const {
      CorreoElectronicoEmpresa,
      TelefonoFijooMovilCont,
      NombreoRazonSocial,
      CorreoContactoComercial,
      NombreContactoPrincipal,
      DireccionComercial,
      NumerodeCuenta,
      RutEmpresa,
      Region,
      Provincia,
      Comuna,
      Banco,
      TipodeCuenta,
      TelefonoFijooMovil,
    } = this.perfilGroup.value;

    casoBizagi.CodBanco = Banco;
    casoBizagi.CodComuna = Comuna;
    casoBizagi.CodProvincia = Provincia;
    casoBizagi.CodRegion = Region;
    casoBizagi.CodTipodeCuenta = TipodeCuenta;
    casoBizagi.CorreoContactoComercial = CorreoContactoComercial;
    casoBizagi.CorreoElectronicoEmpresa = CorreoElectronicoEmpresa;
    casoBizagi.DireccionComercial = DireccionComercial;
    casoBizagi.NombreContactoPrincipal = NombreContactoPrincipal;
    casoBizagi.NombreoRazonSocial = NombreoRazonSocial;
    casoBizagi.NumerodeCuenta = NumerodeCuenta;
    casoBizagi.RutEmpresa = RutEmpresa;
    casoBizagi.TelefonoFijooMovil = TelefonoFijooMovil;
    casoBizagi.TelefonoFijooMovilCont = TelefonoFijooMovilCont;
    casoBizagi.ComentariosAdicionales = "";
    casoBizagi.ContratodeServicios = "";

    Swal.fire({
      title: "¿Desea iniciar el proceso de Enrolamiento?",
      text: "A continuación se ingresará la solicitud en nuestros sistemas.",
      icon: "question",
      showCancelButton: true,

      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Ingreso de solicitud",
          text: "Espere por favor.",
        });
        Swal.showLoading();

        try {
          this._subsCrearCaso = this.bizagiService
            .crearCasoBizagi(casoBizagi)
            .subscribe(async (resp) => {
              if (resp) {
                console.log(resp);
                const caso = resp.processes.process.processRadNumber;
                const processID = resp.processes.process.processId;

                const workItems = resp.processes.process.CurrentWorkItems;
                let taskIdAvance = "0";

                if (workItems != null) {
                  var items: any[] = [];
                  if (Array.isArray(workItems.workItem)) {
                    items = workItems.workItem;
                  } else {
                    items.push(workItems.workItem);
                  }
                  items.forEach((w) => {
                    if (w.task.taskName == "RegCliente") {
                      taskIdAvance = w.task.taskId;
                      return;
                    }
                  });
                }

                if (processID != "0") {
                  //Validar con honorato para ver cuando se debe llamar al RegCliente
                  /*if( taskIdAvance != null && taskIdAvance != '' ){
                this.bizagiService.performActivity( processID, taskIdAvance).subscribe(  respuestaPerfomr=>{
                  console.log(respuestaPerfomr);
                  
                } );
              }
              */
                  var xmlEntity: string = `<UsuariosPayPerPalletWE key='${this.authService._Usuario.id}'>  <RutEmpresaAsociada>${casoBizagi.RutEmpresa}</RutEmpresaAsociada> </UsuariosPayPerPalletWE>`;
                  this.authService._Usuario.RutEmpresaAsociada =
                    casoBizagi.RutEmpresa;
                  this.authService.updateUser();

                  this.bizagiService.saveEntity(xmlEntity).subscribe((resp) => {
                    console.log("Actualizacion usuario", resp);
                  });

                  Swal.close();
                  Swal.fire(
                    "Ingreso Exitoso",
                    `<p>La solicitud de enrolamiento esta en curso. ${caso}</b></p>`,
                    "success"
                  ).then(() => {
                    //this.router.navigate(['/inicio']);
                  });
                } else {
                  Swal.close();
                  Swal.fire(
                    "Ingreso de solicitud",
                    `<p>Ha ocurrido un error al procesar la solicitud, Escribenos a mail@soporte.cl para ayudarte con tu Enrolamiento</p> `,
                    "error"
                  );
                }
              }
            });
        } catch (error) {
          Swal.close();
          Swal.fire(
            "Error",
            `Ha ocurrido un error al ingresar la solicitud: ${error.message} `,
            "error"
          );
        }
      }
    });
  }
}
