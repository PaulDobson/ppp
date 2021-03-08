import { Injectable } from '@angular/core';
import { Region } from 'src/app/models/entidades.bizagi.models';
import { BizagiService } from 'src/app/services/bizagi.service';
 

@Injectable({
  providedIn: 'root'
})
export class RegistrarPerfilService {

  constructor(public bizagi:BizagiService) {

  }


  loadRegiones(){
    
    this.bizagi.getEntities('Region').subscribe(  resp=>{
      console.log(resp);
    }  );

  }

}
