import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import { EmpresaAsociada, Usuario } from 'src/app/models/User.models';
import { BizagiService } from 'src/app/services/bizagi.service';
import { ResponseVO} from '../../models/ResponseVO.models';
import { setEmpresa } from "../store/empresa.actions";
 
import { AES , enc} from 'crypto-js';


import { environment } from 'src/environments/environment';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { setUser , unSetUser} from '../store/auth.actions';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _Usuario:Usuario;

  constructor(private bizagiService:BizagiService, private store: Store<AppState>) { }

  login(  username:string, password:string ){
    
    var filters= `Usuario='${username}' AND Contrasena='${password}'`;
    return this.bizagiService.getEntities( 'UsuariosPayPerPalletWE' , filters).pipe( 
      map( response=>{
       
        if(  response && response.Entities ){
          let en= response.Entities;
          var usuario = new Usuario( en.UsuariosPayPerPalletWE.NombreCompleto,  en.UsuariosPayPerPalletWE.CorreoElectronico,  en.UsuariosPayPerPalletWE.RutDNIPasaporteOtro, en.UsuariosPayPerPalletWE.Usuario, "", en.UsuariosPayPerPalletWE.ActivoparaServicios=='True'?true:false, en.id, en.UsuariosPayPerPalletWE.RutEmpresaAsociada );
          this._Usuario = usuario;
          return usuario;
        }else{
          return null;
        }
      } ),
      tap(  usuario=>{
        if( usuario ){
          var encrypted =AES.encrypt(JSON.stringify(usuario), environment.key).toString();
          localStorage.setItem('x-token',encrypted);
        }
      } )
    );

  }

  getEmpresa( empresa:string ){
    var filters = `RutEmpresa='${empresa}' `;
    this.bizagiService.getEntities("Cliente", filters).subscribe((resp) => {
      if (resp && resp.Entities != null) {
        if(  Array.isArray(  resp.Entities.Cliente ) ){
          var cliente = resp.Entities.Cliente[0];
        }else{
          cliente = resp.Entities.Cliente;
        }
        var emp: EmpresaAsociada = {
          NombreoRazonSocial: cliente.NombreoRazonSocial,
          RutEmpresa: cliente.RutEmpresa,
          CodComuna: cliente.Comuna.CodComuna,
          CodTipodeCuenta: cliente.TipodeCuenta.CodTipodeCuenta,
          CorreoContactoComercial: cliente.CorreoContactoComercial,
          CorreoElectronicoEmpresa: cliente.CorreoElectronicoEmpresa,
          DireccionComercial:cliente.DireccionComercial,
          NombreContactoPrincipal: cliente.NombreContactoPrincipal,
          NumerodeCuenta:cliente.NumerodeCuenta,
          CodBanco: cliente.BancodeCargo.CodBanco,
          Provincia: cliente.Comuna.Provincia,
          TelefonoFijooMovil: cliente.TelefonoFijooMovil,
          TelefonoFijooMovilCont: cliente.TelefonoFijooMovilCont,
          id:cliente.id
        };
        if( emp ){
          var encrypted =AES.encrypt(JSON.stringify(emp), environment.key).toString();
          localStorage.setItem('y-token',encrypted);
        }

        this.store.dispatch(setEmpresa({ empresa: emp }));
      }


    });

  }


  getEmpresaStorage(){

    let ytoken = localStorage.getItem('y-token');
    if( ytoken ){
      let ybytes = AES.decrypt(ytoken, environment.key);
      if(ybytes){
        let emp:EmpresaAsociada =  JSON.parse(ybytes.toString(enc.Utf8));
        if( emp.RutEmpresa == this._Usuario.RutEmpresaAsociada ){
          this.store.dispatch(  setEmpresa( { empresa: emp} ) );
        } 
      }
    }
  }


  updateUser(){
    this.store.dispatch(  setUser( {user:this._Usuario} ) );
  }

  isAuth(){

    var token = localStorage.getItem('x-token');
    if( token ){
      var bytes = AES.decrypt(token, environment.key);
      if( bytes ){
        var user:Usuario = JSON.parse(bytes.toString(enc.Utf8));
        this._Usuario = user;

        this.store.dispatch(  setUser( {user} ) );

        return of(true);
      }
    }
    return of(false);
  }

  logout(){
    localStorage.removeItem('x-token');
    localStorage.removeItem('y-token');
    this.store.dispatch( unSetUser( ) );
  }

  createUser( usuario:Usuario ){

    var xmlEntity:string = `<UsuariosPayPerPalletWE> <NombreCompleto>${usuario.fullName}</NombreCompleto> <CorreoElectronico>${usuario.email}</CorreoElectronico> <Usuario>${usuario.userName}</Usuario> <Contrasena>${usuario.password}</Contrasena> <RutDNIPasaporteOtro>${usuario.rut}</RutDNIPasaporteOtro>  <ActivoparaServicios>0</ActivoparaServicios> </UsuariosPayPerPalletWE>`;
    
 
    return this.bizagiService.saveEntity(xmlEntity).pipe(
      map(  JsonResponse=>{
        if( JsonResponse && JsonResponse.Entities != null && JsonResponse.Entities.UsuariosPayPerPalletWE != null ){
          usuario.id = JsonResponse.Entities.UsuariosPayPerPalletWE;

          var encrypted =AES.encrypt(JSON.stringify(usuario), environment.key).toString();
          localStorage.setItem('x-token',encrypted);          

          return new ResponseVO(true,JsonResponse.Entities.UsuariosPayPerPalletWE);
        }else{

          var errores = "";
          try {
            JsonResponse.forEach(element => {
              if( typeof element.Entities.ErrorMessage != 'undefined' && element.Entities.ErrorMessage){
                 
                console.log(element.Entities.ErrorMessage);
                errores +=`${element.Entities.ErrorMessage}<br>`
              } 
          });
  
          if(typeof errores != 'undefined' && errores.length>0){
            return new ResponseVO(false,"Error al procesar la solicitud", errores);
          } 
          } catch (error) {
            
          }
      

          return new ResponseVO(false,"Error al procesar la solicitud", "No se pudo realizar la solicitud a nuestros sistemas.");
        }

      } )
    );


  }
}
