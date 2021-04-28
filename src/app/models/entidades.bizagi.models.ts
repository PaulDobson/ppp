export interface EmpresaAsociada{
	RutEmpresa:string,
    NombreoRazonSocial:string,
    TelefonoFijooMovilCont?:string,
	CodBanco?:string,
	DireccionComercial?:string,
	CodTipodeCuenta?:string,
	TelefonoFijooMovil?:string,
    CodComuna?:string,
    Provincia?:string,
	NumerodeCuenta?:string,
	CorreoElectronicoEmpresa?:string,
	NombreContactoPrincipal?:string,
	CorreoContactoComercial?:string,
    id?:string,
    Activo?:string,
    _attributes?:_casoAttributes

}
export interface BizAgiWSResponse {
    Entities: any;
    processes?:any;
  }
  
  export interface BizAgiWSError {
    ErrorCode: string;
    ErrorMessage: string;
  }

  export interface _attributes {
    key: string;
  }
  

  export interface Comuna{
    CodComuna:string,
    DescComuna:string,
    Provincia:Provincia
  }

  export interface TipodeCuenta{
    CodTipodeCuenta:string,
    DescTipodeCuenta:string
  }

  export interface BancodeCargo{
    DescripcionBanco:string,
    CodBanco:string
  }


  export interface Provincia{
    Region:Region,
    DescProvincia:string,
    CodProvincia:string,
    id?:string
  }


  export interface Region{
    DescRegion:string,
    CodRegion:string
  }

export interface Ubicaciones{
  CodigoUbicacionFisica:string,
  DescUbicacion:string,
  RutCliente:string,
  FechadeIngreso:string,
  CodUbicacion:string,
  TramodeHoras:TramodeHoras,
  EstadodelaUbicacion:EstadodelaUbicacion,
  Bodega:Bodega,
  Direccion:Direccion,
  Nivel:Nivel,
  EstandardelaUbicacion:EstandardelaUbicacion,
  _attributes?:_casoAttributes
}

export interface EstandardelaUbicacion{
  DescEstandar:string,
  CodEstandar:string,
  id?:string,
  _attributes?:_casoAttributes
}
export interface Nivel{
  CodigoNivel:string,
  DescripciondelNivel:string,
  id?:string,
  _attributes?:_casoAttributes
}
export interface TramodeHoras{
  CodigoTramo:string,
  Tramo:string,
  id?:string,
  seleccionado?:boolean,
  activo?:boolean,
  _attributes?:_casoAttributes
}

export interface EstadodelaUbicacion{
  CodEstado:string,
  DescripcionEstado:string,
  id?:string,
  _attributes?:_casoAttributes
}
 export interface Nave{
  CodigodeNave:string,
  NombredelaNave:string,
  id?:string,
  _attributes?:_casoAttributes
 }

export interface Bodega{
  DescBodega:string,
  CodBodega:string,
  id?:string
}

export interface Direccion{
  CodigoDireccion:string,
  NombreDireccion:string,
  id?:string,
  _attributes?:_casoAttributes

}


export interface TipodePago{
  Cod:string,
  Descripcion:string,
  id?:string,
  _attributes?:_casoAttributes
}


export interface ReservaPosiciones{
  ControlDeAlmacenaje:number,
  Standar?:number,
  CantidadRequerida?:number,
  PosicionesDisponibles?:number,
  CodigodeEstandar?:number,
  TipodeTarifa?:number,
  ObservacionesAdicionales?:string,
  DescTipoTarifa?:string,
  DescStandar?:string,
  id?:string,
  _attributes?:_casoAttributes
}

export interface TipodeTarifa{
  Valor:string,
  CodTipodeTarifa:string,
  DescTipodeTarifa:string,
  Estandar:EstandardelaUbicacion,
  id?:string,
  _attributes?:_casoAttributes
}


export interface _casoControlAlmacenaje{
  Cliente:EmpresaAsociada,
  UbicacionesDisponiblespo:_casoListaUbicaciones,
  DeclaraquenocontieneM?:string,
  FrecuenciadeCobro?:FrecuenciadeCobro,
  ReservadePosiciones?:_casoReservaPosiciones,
  NumerodeCaso?:string,
  OrdendeIngreso?:string,
  FechaHoraIngreso?:Date,
  DetalledeUbicacionesDis?:DetalledeUbicacionesDis,
  OrdenamientoResumen?:OrdenamientoResumen,
  ListadodeHorasDisponibl:ListadodeHorasDisponibl,
  _attributes?:_casoAttributes
}

export interface ListadodeHorasDisponibl{
  ListadodeHorasDisponibles:ListadodeHorasDisponibles[]
}

export interface ListadodeHorasDisponibles{
  CantidadReservada:number,
  Seleccionado:boolean,
  Tramosdisponibles:string,
  _attributes:_casoAttributes

}

export interface OrdenamientoResumen{
  OrdenamientoResumen:_detalleOrdenamientoResumen[],
  _attributes?:_casoAttributes
}

export interface _detalleOrdenamientoResumen{
  Nave:number,
  Cantidad:number,
  Bodega:string,
  ControlDeAlmacenaje:number,
  Piso:string,
  Estandar:string,
  Direccion:string,
  Codigo:string,
  DescripcionEstado:string,
  DescripcionNivel:string,
  Estado:string,
  _attributes?:_casoAttributes
}

export interface _casoReservaPosiciones{
  ReservadePosiciones:ReservaPosiciones[],
  _attributes?:_casoAttributes
}

export interface DetalledeUbicacionesDis{

  DetalledeUbicacionesDisp:DetalledeUbicacionesDisp[],
  _attributes?:_casoAttributes
}
 
export interface DetalledeUbicacionesDisp{
  CodPallet:string,
  CasoAsociado:string,
  ControlDeAlmacenaje:number,
  CodUbicacionNew:string,
  Bodega?:string,
  CodigoUbicacionFisica?:string,
  DescEstandar?:string,
  seleccionado?:boolean,
  CodEstadoUbicacion?:string,
  DescEstadoUbicacion?:string,
  _attributes?:_casoAttributes
}
 
export interface FrecuenciadeCobro{
  CodFrecuencia:string,
  DescripcionFrecuencia:string,
  _attributes?:_casoAttributes
}

export interface _casoListaUbicaciones{
  UbicacionesDisponiblespo:_UbicacionesDisponibles[],
  _attributes?:_casoAttributes
}

export interface _UbicacionesDisponibles{
  ControlDeAlmacenaje:string,
  Estandar:string,
  CantidadDisponible:string,
  CodigoUbicacionFisica?:string,
  DescUbicacion?:string,
  FechadeIngreso?:Date,
  EstadodelaUbicacion?:EstadodelaUbicacion,
  Bodega?:Bodega,
  Direccion?:Direccion,
  EstandardelaUbicacion?:EstandardelaUbicacion,
  CodUbicacion?:string,
  Nave?:Nave,
  Nivel?:Nivel,
  _attributes?:_casoAttributes
}

export interface _casoAttributes{
  key:string,
  entityName?:string
}