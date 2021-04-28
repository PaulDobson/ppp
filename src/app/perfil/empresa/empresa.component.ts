import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/app.reducer";
import { AuthService } from "src/app/auth/services/auth.service";
import { setEmpresaAsociada } from "src/app/auth/store/auth.actions";
import { CasoBizagi } from "src/app/models/casoBizgi.model";
import {
  BancodeCargo,
  Comuna,
  Provincia,
  Region,
  TipodeCuenta,
} from "src/app/models/entidades.bizagi.models";
import { EmpresaAsociada } from "src/app/models/entidades.bizagi.models";
import { BizagiService } from "src/app/services/bizagi.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { cargarBanco } from "../services/store/actions/bizagi.Banco.actions";
import { cargarComunas } from "../services/store/actions/bizagi.comuna.actions";
import { cargarTipoCuenta } from "../services/store/actions/bizagi.Cuenta.actions";
import { cargarProvincia } from "../services/store/actions/bizagi.provincia.actions";
import { SubSink } from "Subsink";
import { cargarRegion } from "../services/store/actions/bizagi.region.actions";
import { Router } from "@angular/router";

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

 

  idEntityEmpresa:string="";

  private subs = new SubSink();

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public bizagiService: BizagiService,
    private store: Store<AppState>,
    private cdRef : ChangeDetectorRef,
    private router:Router
  ) { }

  ngOnDestroy(): void {
    
      this.subs.unsubscribe();
   
    
  }

  ngOnInit(): void {
    this.perfilGroup = this.fb.group({
      CorreoElectronicoEmpresa: ["", [Validators.required]],
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
      RutEmpresa: [
        "",
        [Validators.required, Validators.pattern(/^(\d{8}-)([kK]{1}$|\d{1}$)/)],
      ],
      Region: ["", [Validators.required]],
      Provincia: ["", [Validators.required]],
      Comuna: ["", [Validators.required]],
      //NumerodeCuenta: ["", [Validators.required]],
      //Banco: ["", [Validators.required]],
      //TipodeCuenta: ["", [Validators.required]],
      TelefonoFijooMovil: [
        "",
        [Validators.required, Validators.pattern(/^(\d{9}$)/)],
      ],
    });

    this.store.dispatch(cargarRegion());
    this.store.dispatch(cargarProvincia());
    this.store.dispatch(cargarComunas());
   

 

    this.subs.sink = this.store.select("regiones").subscribe((response) => {
      if (response.loaded) {
        this.listadoRegiones = [...response.bizagiResponse.Entities.Region];
      }
    });
  }

  ngAfterViewInit(): void {
    this.authService.getEmpresaStorage();

    this.subs.sink = this.store.select("empresa").subscribe(({ empresa }) => {
        if (empresa) {
          this.idEntityEmpresa = empresa.id;
          this.cargarDatosEmpresa(empresa);
          this.cdRef.detectChanges();
        }
      });

      //Este componente puede cambiar el estado del usuario con el rut de la empresa asociada.
      this.subs.sink= this.store.select('user').subscribe(  resp=>{
        if( resp.user != undefined){
          this.authService.updateLocalUser(resp.user);
        }
    });


    
  }

  seleccionRegion() {
    let valor = this.RegionCmb.value;
    this.subs.sink = this.store
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

    this.subs.sink = this.store
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
      this.subs.sink = this.bizagiService
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
      RutEmpresa,
      Region,
      Provincia,
      Comuna,
      //NumerodeCuenta,
      //Banco,
      //TipodeCuenta,
      TelefonoFijooMovil,
    } = this.perfilGroup.value;

    //casoBizagi.CodBanco = Banco;
    //casoBizagi.CodTipodeCuenta = TipodeCuenta;
    //casoBizagi.NumerodeCuenta = NumerodeCuenta;
    casoBizagi.CodComuna = Comuna;
    casoBizagi.CodProvincia = Provincia;
    casoBizagi.CodRegion = Region;
    casoBizagi.CorreoContactoComercial = CorreoContactoComercial;
    casoBizagi.CorreoElectronicoEmpresa = CorreoElectronicoEmpresa;
    casoBizagi.DireccionComercial = DireccionComercial;
    casoBizagi.NombreContactoPrincipal = NombreContactoPrincipal;
    casoBizagi.NombreoRazonSocial = NombreoRazonSocial;
    casoBizagi.RutEmpresa = RutEmpresa;
    casoBizagi.TelefonoFijooMovil = TelefonoFijooMovil;
    casoBizagi.TelefonoFijooMovilCont = TelefonoFijooMovilCont;
    casoBizagi.ComentariosAdicionales = "";
    casoBizagi.ContratodeServicios = "";
    casoBizagi.IdUsuarioSolicitante = this.authService._Usuario.id;

    

    if (this.crearCaso) {
      this.CrearEmpresa(casoBizagi);
    } else {
      this.ActualizarDatosEmpresa(casoBizagi);
    }
     
  }

  ActualizarDatosEmpresa(casoBizagi: CasoBizagi) {
   
      casoBizagi.idEntityCliente = this.idEntityEmpresa;
      
        Swal.fire({
          title: "Actualizando datos de empresa",
          text: "Espere por favor.",
        });
        Swal.showLoading();

        try {
          this.subs.sink = this.bizagiService
            .actualizarDatosEmpresa(casoBizagi )
            .subscribe( (resp) => {
              if (resp) {
                console.log("response actualizacion empresa", resp);

                  Swal.close();
                  Swal.fire(
                    "Actualización",
                    `Los datos de la empresa se han actualizado exitosamente`,
                    "success"
                  ).then(() => {
                    this.authService.getEmpresa(casoBizagi.RutEmpresa);
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
            );
        } catch (error) {
          Swal.close();
          Swal.fire(
            "Error",
            `Ha ocurrido un error al actualizar los datos de la empresa : ${error.message} `,
            "error"
          );
        }
 
  }

  CrearEmpresa(casoBizagi: CasoBizagi) {
    

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
          allowEscapeKey:false,
          allowOutsideClick:false
        });
        Swal.showLoading();

        try {
          this.subs.sink = this.bizagiService
            .crearCasoBizagi(casoBizagi)
            .subscribe(async (resp) => {
              if (resp) {
                
                const caso = resp.processes.process.processRadNumber;
                const processID = resp.processes.process.processId;

                const workItems = resp.processes.process.CurrentWorkItems;
                let taskIdAvance = "0";

              
                if (processID != "0") {

                  if (taskIdAvance != null && taskIdAvance != '') {
                    
                    this.subs.sink =this.bizagiService.performActivity(processID, environment.taskIDEnrolamiento).subscribe(respuestaPerfomr => {
                      
                      

                    });
                  }

                  var xmlEntity: string = `<UsuariosPayPerPalletWE key='${this.authService._Usuario.id}'>  <RutEmpresaAsociada>${casoBizagi.RutEmpresa}</RutEmpresaAsociada> </UsuariosPayPerPalletWE>`;
                  this.subs.sink = this.bizagiService.saveEntity(xmlEntity).subscribe((resp) => {
                    console.log("Actualizacion usuario", resp);

                    this.store.dispatch(setEmpresaAsociada({ rutEmpresa: casoBizagi.RutEmpresa }));
                  
                  });

                  Swal.close();
                  Swal.fire(
                    "Ingreso Exitoso",
                    `<p>La solicitud de enrolamiento esta en curso. ${caso}</b></p>`,
                    "success"
                  ).then(() => {
                    this.router.navigate(['/inicio']);
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




  cargarDatosEmpresa(empresa: EmpresaAsociada): void {
    this.crearCaso = false;

    this.perfilGroup.patchValue( {
      CorreoElectronicoEmpresa:empresa.CorreoElectronicoEmpresa,
      RutEmpresa:empresa.RutEmpresa,
      TelefonoFijooMovilCont:empresa.TelefonoFijooMovilCont ,
      NombreoRazonSocial:empresa.NombreoRazonSocial ,
      CorreoContactoComercial:empresa.CorreoContactoComercial ,
      NombreContactoPrincipal:empresa.NombreContactoPrincipal ,
      DireccionComercial:empresa.DireccionComercial ,
      TelefonoFijooMovil:empresa.TelefonoFijooMovil ,
      //NumerodeCuenta:empresa.NumerodeCuenta ,
      //Banco:empresa.CodBanco ,
      //TipodeCuenta:empresa.CodTipodeCuenta ,
    } );

    //this.perfilGroup.get("RutEmpresa").disable({ onlySelf: true });

    if (empresa.Provincia != undefined && empresa.Provincia != "") {
      this.subs.sink = this.store
        .select("provincias")
        .pipe(
          map((provinciaState) => {
            if (provinciaState.loaded) {
              if (
                Array.isArray(provinciaState.bizagiResponse.Entities.Provincia)
              ) {
                let listProv: any[] =
                  provinciaState.bizagiResponse.Entities.Provincia;
                return listProv.filter(
                  (x) => x._attributes.key == empresa.Provincia
                );
              } else {
                if (
                  provinciaState.bizagiResponse.Entities.Provincia.id ==
                  empresa.Provincia
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
            this.RegionCmb.setValue(this.listadoProvincias[0].Region.CodRegion);
            this.perfilGroup
              .get("Provincia")
              .setValue(this.listadoProvincias[0].CodProvincia);

            this.subs.sink = this.store
              .select("comunas")
              .pipe(
                map((comunas) => {
                  if (comunas.loaded) {
                    if (Array.isArray(comunas.bizagiResponse.Entities.Comuna)) {
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
                        listComuna.push(comunas.bizagiResponse.Entities.Comuna);

                        return listComuna;
                      }
                    }
                  }
                })
              )
              .subscribe((comunas) => {
                if (comunas && comunas.length > 0) {
                  this.listadoComuna = [...comunas];
                  this.perfilGroup.get("Comuna").setValue(empresa.CodComuna);
                }
              });
          }
        });
    }
  }

}
