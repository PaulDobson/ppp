export class Usuario{
    
    constructor(
        public fullName:string,
        public email:string,
        public rut:string,
        public userName:string,
        public password:string,
        public habilitado?:boolean,
        public id?:string,
        public RutEmpresaFK?:string
    ){
        
    }

}


