import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { RouterModule, Routes } from "@angular/router";
import { RegistroComponent } from "./registro/registro.component";
import { EnrolamientoComponent } from "./registro/enrolamiento/enrolamiento.component";
import { MaterialModule } from "../app.module";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "registro",
        component: RegistroComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule],
  declarations: [RegistroComponent, LoginComponent, EnrolamientoComponent],
  exports: [RegistroComponent, LoginComponent],
})
export class AuthModule { }
