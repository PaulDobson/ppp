import { Injectable } from '@angular/core';
import { NgxSoapService, Client } from 'ngx-soap';
import { Observable } from 'rxjs';
import * as txml from 'txml';
import {environment} from '../../environments/environment';
import { map } from 'rxjs/operators';
import { BizAgiWSError, BizAgiWSResponse } from '../models/entidades.bizagi.models';
import { CasoBizagi } from '../models/casoBizgi.model';

@Injectable({
  providedIn: 'root'
})
export class BizagiService {

  clientWF: Client;
  clientEM: Client;

  constructor(private soap: NgxSoapService) { 
    this.init();
  }

  initServices$ = new Observable<Boolean>( (observer)=>{
    if( this.clientEM==undefined ){
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 3000);
    }else{
      observer.next(true);
      observer.complete();
    }

  }  );

  initServicesWF$ = new Observable<Boolean>( (observer)=>{
    if( this.clientWF==undefined ){
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 2000);
    }else{
      observer.next(true);
      observer.complete();
    }

  }  );

  async init(){
    console.log('init Soap service');
    this.initWorkflowenginesoa();
    this.initEntitymanagersoa();
  }

  initServices():Observable<Boolean>{
    return this.initServices$;
  }

  initServicesWF():Observable<Boolean>{
    return this.initServicesWF$;
  }

  private initWorkflowenginesoa() {
    console.log(  'await on call initWorkflowenginesoa');
   return this.soap
      .createClient(
        `${environment.url_bizagi_we}?WSDL`,
        { forceSoap12Headers: true },
        environment.url_bizagi_we
      ).then(c=>{
        this.clientWF = c;
      })
      .catch((error) => {
        console.log('error:', error);
      });   
  }

  private initEntitymanagersoa() {
    console.log('await on call initEntitymanagersoa');
    return this.soap
      .createClient(
        `${environment.url_bizagi_em}?WSDL`,
        { forceSoap12Headers: true },
        environment.url_bizagi_em
      ).then( c=>{
        console.log('resolve await initEntitymanagersoa');
        this.clientEM = c;
      } )
      .catch((error) => {
        console.log('error:', error);
      });
      
  }

  getEntities(entityName: string, filter?:string){

    var body = {
      entitiesInfo: `<![CDATA[<BizAgiWSParam><EntityData><EntityName>${entityName}</EntityName></EntityData></BizAgiWSParam>]]>`,
    };

    if( filter ){
      body = {
        entitiesInfo: `<![CDATA[<BizAgiWSParam><EntityData><EntityName>${entityName}</EntityName> <Filters>${filter}</Filters> </EntityData></BizAgiWSParam>]]>`,
      };
    }

    return this.clientEM.call('getEntitiesAsString', body).pipe(
      map((respuesta) => {
        const message = respuesta.result.getEntitiesAsStringResult;
        let json: any[] = txml.parse(message);
        let jsonPrsed: any = txml.simplify(json);

        if (jsonPrsed.BizAgiWSError) {
          const error: BizAgiWSError = jsonPrsed.BizAgiWSError;
          throw new Error(error.ErrorCode + ':' + error.ErrorMessage);
        } else {
          var entities: BizAgiWSResponse = jsonPrsed.BizAgiWSResponse;

          if( json[1].children[0].children[0] != null && json[1].children[0].children[0]!= undefined ){
            let keyEntidad = json[1].children[0].children[0].attributes.key;
            entities.Entities.id=keyEntidad;
          }
          
        
          return entities;
        }
      })
    );

  }

  performActivity(idCase:string,taskId:string){
    const body = {
      activityInfo: `<![CDATA[<BizAgiWSParam><domain>${environment.domain}</domain><userName>${environment.usuario_creador_caso}</userName><ActivityData><radNumber>${idCase}</radNumber><taskName>${taskId}</taskName></ActivityData></BizAgiWSParam>]]>`,
    };
    return this.clientWF.call( 'performActivityAsString', body ).pipe(
      map(  (respuesta)=>{
        const message = respuesta.result.performActivityAsStringResult;
        let json: any[] = txml.parse(message);
        let jsonPrsed: any = txml.simplify(json);

        return jsonPrsed;
      } )
    )

  }
  

  crearCasoBizagi(casoBizagi: CasoBizagi) {
    const body = {
      casesInfo: `<![CDATA[${casoBizagi.toXML()}]]>`,
    };

    return this.clientWF.call('createCasesAsString', body ).pipe(
      map(  (respuesta)=>{
        const message = respuesta.result.createCasesAsStringResult;
        let json: any[] = txml.parse(message);
        let jsonPrsed: any = txml.simplify(json);
         
        return jsonPrsed;
      } ) 
    )
  }

  crearCasoSolicitudIngreso(xml: string) {
    const body = {
      casesInfo: `<![CDATA[${xml}]]>`,
    };

    return this.clientWF.call('createCasesAsString', body ).pipe(
      map(  (respuesta)=>{
        const message = respuesta.result.createCasesAsStringResult;
        let json: any[] = txml.parse(message);
        let jsonPrsed: any = txml.simplify(json);
         
        return jsonPrsed;
      } ) 
    )
  }

  
  actualizarDatosEmpresa(casoBizagi: CasoBizagi ){
    return this.saveEntity( casoBizagi.toXMLSaveEntity() );
  }

  saveEntity(entities:string ){
    const body = {
      entityInfo: `<![CDATA[<BizAgiWSParam><Entities>${entities}</Entities></BizAgiWSParam>]]>`,
    };

    
    return this.clientEM.call( 'saveEntityAsString' , body ).pipe(
      map(  (respuesta)=>{
        const message = respuesta.result.saveEntityAsStringResult;
        let json: any[] = txml.parse( message );
        let jsonParsed:any = txml.simplify(json);
        return jsonParsed;
      } )

    );

  }


  saveEntityCase(entities:string ){
    const body = {
      entityInfo: `<![CDATA[${entities}]]>`,
    };


    return this.clientEM.call( 'saveEntityAsString' , body ).pipe(
      map(  (respuesta)=>{
        const message = respuesta.result.saveEntityAsStringResult;
        let json: any[] = txml.parse( message );
        let jsonParsed:any = txml.simplify(json);
        return jsonParsed;
      } )

    );

  }

}
