import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State, Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Usuario } from 'src/app/models/User.models';
 

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
    private store: Store<AppState>,) { }

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
      this.usuario = user;
      this.perfilGroup.get('userName').setValue( this.usuario.userName);
      this.perfilGroup.get('fullName').setValue( this.usuario.fullName);
      this.perfilGroup.get('email').setValue( this.usuario.email);
      this.perfilGroup.get('rut').setValue( this.usuario.rut);
      this.perfilGroup.get('password').setValue( "defecto");
      this.perfilGroup.get('password2').setValue( "defecto");

    });
    
  }
  UpdateUser(){

  }

  initComponents(user:Usuario){

  }

}
