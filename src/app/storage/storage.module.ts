import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { RouterModule, Routes } from '@angular/router';
import { RetiroComponent } from './retiro/retiro.component';
import { MaterialModule } from '../app.module';
import { ReservaPosicionesComponent } from './shared/reserva-posiciones/reserva-posiciones.component';
import { StorageService } from './services/storage.service';
import { DetalleComponent } from './retiro/detalle/detalle.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'registro',
        component: RegistroComponent,
      },
      {
        path: 'retiro',
        component: RetiroComponent,
        children:[
          {
            path:':numCaso',
            component: DetalleComponent
          }
        ]
      },
    ],
  },
];


@NgModule({
  declarations: [RegistroComponent, RetiroComponent, ReservaPosicionesComponent, DetalleComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), MaterialModule
  ],
  entryComponents: [
    ReservaPosicionesComponent
  ],
  providers:[StorageService]
})
export class StorageModule { }
