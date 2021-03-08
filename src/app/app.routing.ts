import { Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth.guard';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { EmpresaComponent } from './perfil/empresa/empresa.component';
import { UsuarioComponent } from './perfil/usuario/usuario.component';

export const AppRoutes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'inicio',
    }, {
      path: '',
      component: AdminLayoutComponent,
      canActivate: [ AuthGuard ],
      children: [
          {
        path: 'inicio',
        loadChildren: './inicio/inicio.module#InicioModule'
    } ,{
        path: 'storage',
        loadChildren: './storage/storage.module#StorageModule'
    },{
        path: 'perfil',
        component:UsuarioComponent
    },{
        path: 'empresa',
        component:EmpresaComponent
    }
  ]}, {
      path: '',
      component: AuthLayoutComponent,
      children: [{
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule'
      }]
    }
];
