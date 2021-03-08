export class Usuario{
    public empresa:EmpresaAsociada;
    
    constructor(
        public fullName:string,
        public email:string,
        public rut:string,
        public userName:string,
        public password:string,
        public habilitado?:boolean,
        public id?:string,
        public RutEmpresaAsociada?:string
    ){}

}


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

}