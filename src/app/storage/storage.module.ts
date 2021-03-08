import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { RouterModule, Routes } from '@angular/router';
import { RetiroComponent } from './retiro/retiro.component';


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
      },
    ],
  },
];


@NgModule({
  declarations: [RegistroComponent, RetiroComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class StorageModule { }
