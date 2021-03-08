export interface BizAgiWSResponse {
    Entities: any;
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

