import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.reducer";
import { EmpresaAsociada, Usuario } from "src/app/models/User.models";
import { BizagiService } from "src/app/services/bizagi.service";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth.service";
import { setUser } from "../store/auth.actions";


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginGroup: FormGroup;
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  constructor(
    private element: ElementRef,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService,
    private bizagiService: BizagiService,
    private router: Router
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");
    const card = document.getElementsByClassName("card")[0];

    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove("card-hidden");
    }, 700);

    this.loginGroup = this.fb.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName("body")[0];
    var sidebar = document.getElementsByClassName("navbar-collapse")[0];
    if (this.sidebarVisible == false) {
      setTimeout(function () {
        toggleButton.classList.add("toggled");
      }, 500);
      body.classList.add("nav-open");
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove("toggled");
      this.sidebarVisible = false;
      body.classList.remove("nav-open");
    }
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }

  login() {
    if (this.loginGroup.invalid) return;

    const { userName, password } = this.loginGroup.value;

    this.authService.login(userName, password).subscribe((resp) => {
      if (resp) {
        let user: Usuario = resp;
        this.authService.getEmpresa(user.RutEmpresaAsociada);
        
        this.store.dispatch(setUser({ user }));

        this.router.navigate(["/inicio"]);

      } else {
        Swal.fire(
          "Ingreso a portal Pay Per Pallet",
          "Usuario o contraseña no existe",
          "error"
        );
      }
    });
  }
}
