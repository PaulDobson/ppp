import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BizagiService } from 'src/app/services/bizagi.service';

@Component({
  selector: 'app-retiro',
  templateUrl: './retiro.component.html',
  styleUrls: ['./retiro.component.css']
})
export class RetiroComponent implements OnInit , AfterViewInit, OnDestroy {

  _subsUser: Subscription;
  habilitado:boolean=false;

  constructor(private fb: FormBuilder,
    public authService: AuthService,
    public bizagiService: BizagiService,
    private store: Store<AppState>) { 

    }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {

    this._subsUser = this.store.select('user').subscribe(  usuario=>{
      if(  usuario && usuario.user ){
        if( usuario.user.habilitado ){
            this.habilitado = true;
        }else{
            this.habilitado = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if( this._subsUser ){
      this._subsUser.unsubscribe();
    }
  }
}
