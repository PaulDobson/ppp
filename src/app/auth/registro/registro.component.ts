import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2'
import { Usuario } from '../../models/User.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { setUser } from '../store/auth.actions';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
    registroGroup: FormGroup;
    test: Date = new Date();

  constructor( 
    private fb: FormBuilder,
    private authService:AuthService,
    private store: Store<AppState>,
    private router:Router) { 

    }

    ngOnInit() {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('register-page');
      body.classList.add('off-canvas-sidebar');


      this.registroGroup = this.fb.group({
        fullName: ['',Validators.required],
        email:['', [Validators.required, Validators.email]],
        rut:['',Validators.required],
        userName:['', Validators.required],
        password:['', Validators.required],
        
      });

    }
    ngOnDestroy(){
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('register-page');
      body.classList.remove('off-canvas-sidebar');
    }

    CreateUser(){
      if( this.registroGroup.invalid ){
        console.log("formulario con error: " + this.registroGroup.value);
        return;
      }

      const{ fullName, email, rut, userName, password} = this.registroGroup.value;

      Swal.fire({
        title: 'Ingreso de solicitud',
        text: 'Espere por favor.'
      });
      Swal.showLoading();
    
      var user = new Usuario( fullName, email, rut, userName, password );

      this.authService.createUser( user ).subscribe( response=>{
        Swal.close();
        console.log(response);
        if( response.ok ){

          let idUsuario = response.mensaje;
          user.id = idUsuario;

          this.store.dispatch( setUser({user}) );

          this.router.navigate(['/inicio']);

        }else{
          Swal.fire({
            title: 'Ingreso de solicitud',
            text: `${response.mensaje}<br>${response.error}`
          });
        }
        
      } )
   
    }


    getErrorMessage() {
      if ( this.registroGroup.get('email').hasError('required')) {
        return 'You must enter a value';
      }
  
   
      return this.registroGroup.get('email').hasError('email') ? 'Not a valid email' : '';
    }

}
