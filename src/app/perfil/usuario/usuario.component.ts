import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State, Store, select } from '@ngrx/store';

import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/auth/services/auth.service';
import { setUser } from 'src/app/auth/store/auth.actions';
import { Usuario } from 'src/app/models/User.models';
import { BizagiService } from 'src/app/services/bizagi.service';
import Swal from 'sweetalert2';
 

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  perfilGroup: FormGroup;
  usuario:Usuario;

  constructor(
    private fb: FormBuilder,
    public authService:AuthService,
    private store: Store<AppState>,private bizagiService:BizagiService) { }

  ngOnInit(): void {

   
    this.perfilGroup = this.fb.group({
      fullName: ['',Validators.required],
      email:['', [Validators.required, Validators.email]],
      rut:['',Validators.required],
      userName:['', Validators.required],
      password:['', Validators.required],
      password2:['', Validators.required],
    });


    this.store.select('user').subscribe( ({user})=>{
      if( user ){
        
        this.usuario = user;
        this.perfilGroup.get('userName').setValue( this.usuario.userName);
        this.perfilGroup.get('fullName').setValue( this.usuario.fullName);
        this.perfilGroup.get('email').setValue( this.usuario.email);
        this.perfilGroup.get('rut').setValue( this.usuario.rut);
        this.perfilGroup.get('password').setValue( "defecto");
        this.perfilGroup.get('password2').setValue( "defecto");
      }

    });
    
  }
  

  UpdateUser(){
    if( this.perfilGroup.invalid ){
      console.log("formulario con error: " + this.perfilGroup.value);
      return;
    }

    const{ fullName, email, rut, userName, password,password2} = this.perfilGroup.value;

    if(password != password2){
      Swal.fire({
        title: 'Atención',
        text: 'Contraseñas ingresadas no coinciden.',
        icon:'error'
      });
      return;
    }

    

    if( password == 'defecto' ){
      var xmlEntity:string = `<UsuariosPayPerPalletWE key='${this.usuario.id}'> <NombreCompleto>${fullName}</NombreCompleto> <CorreoElectronico>${email}</CorreoElectronico> <Usuario>${userName}</Usuario>   <RutDNIPasaporteOtro>${rut}</RutDNIPasaporteOtro>    </UsuariosPayPerPalletWE>`;
    
    }else{
      xmlEntity = `<UsuariosPayPerPalletWE key='${this.usuario.id}'> <NombreCompleto>${fullName}</NombreCompleto> <CorreoElectronico>${email}</CorreoElectronico> <Usuario>${userName}</Usuario> <Contrasena>${password}</Contrasena> <RutDNIPasaporteOtro>${rut}</RutDNIPasaporteOtro>    </UsuariosPayPerPalletWE>`;
    }

    Swal.fire({
      title: 'Actualizando datos del perfil',
      text: 'Espere por favor.'
    });
    Swal.showLoading();
  
    this.bizagiService.saveEntity( xmlEntity ).subscribe( response=>{
      Swal.close();
     
      if( response ){
        
        this.authService.getUsuario(this.usuario.id).subscribe( resp=>{
              if(resp){
                let user: Usuario = resp;
                this.store.dispatch(setUser({ user }));
 
              }
        } );

      }else{
        Swal.fire({
          title: 'Ingreso de solicitud',
          text: `${response.mensaje}<br>${response.error}`
        });
      }
      
    } )
 
  }


}
