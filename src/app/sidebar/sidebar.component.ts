import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import PerfectScrollbar from 'perfect-scrollbar';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from '../app.reducer';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/inicio',
        title: 'Bienvenido',
        type: 'link',
        icontype: 'dashboard'
    },{
        path: '/storage',
        title: 'Almacenaje',
        type: 'sub',
        icontype: 'apps',
        collapse: 'storage',
        children: [
            {path: 'registro', title: 'Completar Registro', ab:'CR'},
            {path: 'retiro', title: 'Solicitud Retiro', ab:'SR'},
        ]
    } 
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit ,OnDestroy{
    public menuItems: any[];
    ps: any;
    usuario:string;
    userSubs: Subscription;

    constructor(private store: Store<AppState> ){
        
    }
    ngOnDestroy(): void {
        this.userSubs.unsubscribe();
    }


    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }

        this.userSubs = this.store.select('user')
        .pipe(
          filter( ({user}) => user != null )
        )
        .subscribe( ({ user }) => this.usuario = user.fullName );
    }
    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
