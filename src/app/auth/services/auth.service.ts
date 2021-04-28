import { Injectable } from "@angular/core";
import { of } from "rxjs";

import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { Usuario } from "../../models/User.models";
import { EmpresaAsociada } from "../../models/entidades.bizagi.models";
import { BizagiService } from "src/app/services/bizagi.service";
import { ResponseVO } from "../../models/ResponseVO.models";
import { setEmpresa } from "../store/empresa.actions";

import { AES, enc } from "crypto-js";

import { environment } from "src/environments/environment";
import { AppState } from "src/app/app.reducer";
import { Store } from "@ngrx/store";
import {
  setEmpresaAsociada,
  setHabilitadoParaServicio,
  setUser,
  unSetUser,
} from "../store/auth.actions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public _Usuario: Usuario;

  constructor(
    private bizagiService: BizagiService,
    private store: Store<AppState>
  ) {
    console.log("Iniciando servico Auth", this._Usuario);
  }

  login(username: string, password: string) {
    var filters = `Usuario='${username}' AND Contrasena='${password}'`;
    return this.bizagiService
      .getEntities("UsuariosPayPerPalletWE", filters)
      .pipe(
        map((response) => {
          if (response && response.Entities) {
            let en = response.Entities;
            let rut = en.UsuariosPayPerPalletWE.RutEmpresaAsociada;

            let usuario = new Usuario(
              en.UsuariosPayPerPalletWE.NombreCompleto,
              en.UsuariosPayPerPalletWE.CorreoElectronico,
              en.UsuariosPayPerPalletWE.RutDNIPasaporteOtro,
              en.UsuariosPayPerPalletWE.Usuario,
              "",
              en.UsuariosPayPerPalletWE.ActivoparaServicios == "True"
                ? true
                : false,
              en.id,
              rut
            );

            this._Usuario = usuario;
            return usuario;
          } else {
            return null;
          }
        }),
        tap((usuario) => {
          if (usuario) {
            let encrypted = AES.encrypt(
              JSON.stringify(usuario),
              environment.key
            ).toString();
            localStorage.setItem("x-token", encrypted);
          }
        })
      );
  }

  getUsuario(id: string) {
    var filters = `idUsuariosPayPerPalletWE='${id}'`;
    return this.bizagiService
      .getEntities("UsuariosPayPerPalletWE", filters)
      .pipe(
        map((response) => {
          if (response && response.Entities) {
            let en = response.Entities;
            let rut = en.UsuariosPayPerPalletWE.RutEmpresaAsociada;

            let usuario = new Usuario(
              en.UsuariosPayPerPalletWE.NombreCompleto,
              en.UsuariosPayPerPalletWE.CorreoElectronico,
              en.UsuariosPayPerPalletWE.RutDNIPasaporteOtro,
              en.UsuariosPayPerPalletWE.Usuario,
              "",
              en.UsuariosPayPerPalletWE.ActivoparaServicios == "True"
                ? true
                : false,
              en.id,
              rut
            );

            this._Usuario = usuario;
            return usuario;
          } else {
            return null;
          }
        }),
        tap((usuario) => {
          if (usuario) {
            let encrypted = AES.encrypt(
              JSON.stringify(usuario),
              environment.key
            ).toString();
            localStorage.setItem("x-token", encrypted);
          }
        })
      );
  }

  getEmpresa(rutEmpresa: string) {
    var filters = `RutEmpresa='${rutEmpresa}' `;
    console.log("Obtiene empresa de cliente registrado");
    this.bizagiService.initServices().subscribe((estado) => {
      if (estado) {
        this.bizagiService.getEntities("Cliente", filters).subscribe((resp) => {
          if (resp && resp.Entities != null) {
            if (Array.isArray(resp.Entities.Cliente)) {
              var cliente = resp.Entities.Cliente[0];
            } else {
              cliente = resp.Entities.Cliente;
            }
            if (cliente != undefined) {
              let emp: EmpresaAsociada = {
                NombreoRazonSocial: cliente.NombreoRazonSocial,
                RutEmpresa: cliente.RutEmpresa,
                CodComuna: cliente.Comuna.CodComuna,
                CorreoContactoComercial: cliente.CorreoContactoComercial,
                CorreoElectronicoEmpresa: cliente.CorreoElectronicoEmpresa,
                DireccionComercial: cliente.DireccionComercial,
                NombreContactoPrincipal: cliente.NombreContactoPrincipal,
                Provincia: cliente.Comuna.Provincia,
                TelefonoFijooMovil: cliente.TelefonoFijooMovil,
                TelefonoFijooMovilCont: cliente.TelefonoFijooMovilCont,
                id: cliente._attributes.key,
                //CodTipodeCuenta: cliente.TipodeCuenta.CodTipodeCuenta,
                //NumerodeCuenta:cliente.NumerodeCuenta,
                //CodBanco: cliente.BancodeCargo.CodBanco,
              };

              if (this._Usuario.RutEmpresaFK != cliente.RutEmpresa) {
                this.store.dispatch(
                  setEmpresaAsociada({ rutEmpresa: cliente.RutEmpresa })
                );
              }
              //var encrypted =AES.encrypt(JSON.stringify(emp), environment.key).toString();
              //localStorage.setItem('y-token',encrypted);

              this.store.dispatch(setEmpresa({ empresa: emp }));
            }
          }
        });
      }
    });
  }

  getEmpresaStorage() {
    this.getEmpresa(this._Usuario.RutEmpresaFK);

    /*
    let ytoken = localStorage.getItem('y-token');
    if( ytoken ){
      let ybytes = AES.decrypt(ytoken, environment.key);
      if(ybytes){
        let emp:EmpresaAsociada =  JSON.parse(ybytes.toString(enc.Utf8));
        if( emp.RutEmpresa == this._Usuario.RutEmpresaFK ){
          this.store.dispatch(  setEmpresa( { empresa: emp} ) );
        } 
      }
    }else{
    
        this.getEmpresa( this._Usuario.RutEmpresaFK );
      
    }*/
  }

  updateLocalUser(user) {
    this._Usuario = user;
    var encrypted = AES.encrypt(
      JSON.stringify(user),
      environment.key
    ).toString();
    localStorage.setItem("x-token", encrypted);
  }

  isAuth() {
    var token = localStorage.getItem("x-token");
    if (token) {
      var bytes = AES.decrypt(token, environment.key);
      if (bytes) {
        var user: Usuario = JSON.parse(bytes.toString(enc.Utf8));
        this._Usuario = user;

        if (!this._Usuario.habilitado) {
          var filters = `idUsuariosPayPerPalletWE='${this._Usuario.id}'`;

          this.bizagiService
            .initServices()
            .pipe(
              mergeMap(() =>
                this.bizagiService.getEntities(
                  "UsuariosPayPerPalletWE",
                  filters
                )
              )
            )
            .subscribe((usuarioResponse) => {
              if (usuarioResponse && usuarioResponse.Entities) {
                let en = usuarioResponse.Entities;

                if (en.UsuariosPayPerPalletWE.ActivoparaServicios == "True") {
                  this.store.dispatch(
                    setHabilitadoParaServicio({ habilitado: true })
                  );
                }
              }
            });
        }

        this.store.dispatch(setUser({ user: this._Usuario }));
        return of(true);
      }
    } else {
      return of(false);
    }
  }

  logout() {
    localStorage.removeItem("x-token");
    localStorage.removeItem("y-token");
    this.store.dispatch(unSetUser());
  }

  createUser(usuario: Usuario) {
    var xmlEntity: string = `<UsuariosPayPerPalletWE> <NombreCompleto>${usuario.fullName}</NombreCompleto> <CorreoElectronico>${usuario.email}</CorreoElectronico> <Usuario>${usuario.userName}</Usuario> <Contrasena>${usuario.password}</Contrasena> <RutDNIPasaporteOtro>${usuario.rut}</RutDNIPasaporteOtro>  <ActivoparaServicios>0</ActivoparaServicios> </UsuariosPayPerPalletWE>`;

    return this.bizagiService.saveEntity(xmlEntity).pipe(
      map((JsonResponse) => {
        if (
          JsonResponse &&
          JsonResponse.Entities != null &&
          JsonResponse.Entities.UsuariosPayPerPalletWE != null
        ) {
          usuario.id = JsonResponse.Entities.UsuariosPayPerPalletWE;

          var encrypted = AES.encrypt(
            JSON.stringify(usuario),
            environment.key
          ).toString();
          localStorage.setItem("x-token", encrypted);

          return new ResponseVO(
            true,
            JsonResponse.Entities.UsuariosPayPerPalletWE
          );
        } else {
          var errores = "";
          try {
            JsonResponse.forEach((element) => {
              if (
                typeof element.Entities.ErrorMessage != "undefined" &&
                element.Entities.ErrorMessage
              ) {
                console.log(element.Entities.ErrorMessage);
                errores += `${element.Entities.ErrorMessage}<br>`;
              }
            });

            if (typeof errores != "undefined" && errores.length > 0) {
              return new ResponseVO(
                false,
                "Error al procesar la solicitud",
                errores
              );
            }
          } catch (error) {}

          return new ResponseVO(
            false,
            "Error al procesar la solicitud",
            "No se pudo realizar la solicitud a nuestros sistemas."
          );
        }
      })
    );
  }
}
