import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


declare const require: any;

declare const $: any;

@Component({
    selector: 'app-extendedforms-cmp',
    templateUrl: 'extendedforms.component.html',
    styleUrls: ['panel.css'],
})

export class ExtendedFormsComponent implements OnInit, AfterViewInit {
    simpleSlider = 40;
    doubleSlider = [20, 60];

    regularItems = ['Pizza', 'Pasta', 'Parmesan'];
    touch: boolean;

    selectedValue: string;
    currentCity: string[];

    selectTheme = 'primary';
  
    displayedColumns: string[] = ['pallet', 'estandar', 'ingreso', 'tarifa','seleccionado'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;


    ngOnInit() {}
    myFunc(val: any) {
          // code here
    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
    
}

export interface PeriodicElement {
  pallet: string;
  estandar: string;
  ingreso: string;
  tarifa: string;
  seleccionado: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {pallet: 'Pallet 1', estandar: 'Altura Base 1.0', ingreso: '23-12-2020', tarifa: 'X Horas', seleccionado:false},
  {pallet: 'Pallet 2', estandar: 'Altura Base 1.0', ingreso: '25-12-2020', tarifa: 'X Horas', seleccionado:false},
  {pallet: 'Pallet 3', estandar: 'Altura Base 1.0', ingreso: '12-01-2021', tarifa: 'X Horas', seleccionado:false},
  {pallet: 'Pallet 4', estandar: 'Altura Base 1.0', ingreso: '15-01-2021', tarifa: 'X Horas', seleccionado:false},
  {pallet: 'Pallet 5', estandar: 'Altura Base 1.0', ingreso: '03-02-2021', tarifa: 'X Horas', seleccionado:false},
];
