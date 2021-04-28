export class CasoBizagi {
  public domain: string = "";
  public userName: string = "";
  public Process: string = "";
  public CorreoElectronicoEmpresa: string = "";
  public ComentariosAdicionales: string = "";
  public ContratodeServicios: string = "";
  public CodTipodeCuenta: string = "";
  public CodBanco: string = "";
  public TelefonoFijooMovilCont: string = "";
  public NombreoRazonSocial: string = "";
  public CorreoContactoComercial: string = "";
  public CodComuna: string = "";
  public CodRegion: string = "";
  public CodProvincia: string = "";
  public NombreContactoPrincipal: string = "";
  public DireccionComercial: string = "";
  public NumerodeCuenta: string = "";
  public RutEmpresa: string = "";
  public TelefonoFijooMovil: string = "";
  public IdUsuarioSolicitante: string = "";
  public idEntityCliente: string = "";
  constructor() {}

  toXMLSaveEntity(): string {
    return ` <Cliente key='${this.idEntityCliente}'>
      <CorreoElectronicoEmpresa> ${
        this.CorreoElectronicoEmpresa || ""
      }</CorreoElectronicoEmpresa> 
      <TelefonoFijooMovilCont>${
        this.TelefonoFijooMovilCont || ""
      }</TelefonoFijooMovilCont>
    
  
      <NombreoRazonSocial>${this.NombreoRazonSocial || ""}</NombreoRazonSocial>
      <CorreoContactoComercial>${
        this.CorreoContactoComercial || ""
      }</CorreoContactoComercial>
      <Comuna entityName="Comuna">
        <Provincia entityName="Provincia">
          <CodProvincia>${this.CodProvincia || ""}</CodProvincia>
          <Region entityName="Region">
            <CodRegion>${this.CodRegion || ""}</CodRegion>
          </Region>
        </Provincia>
        <CodComuna>${this.CodComuna || ""}</CodComuna>
      </Comuna>
      <NombreContactoPrincipal>${
        this.NombreContactoPrincipal || ""
      }</NombreContactoPrincipal>
      <DireccionComercial>${this.DireccionComercial || ""}</DireccionComercial>
      
      <RutEmpresa>${this.RutEmpresa || ""}</RutEmpresa>
      <TelefonoFijooMovil>${this.TelefonoFijooMovil || ""}</TelefonoFijooMovil>
     
    </Cliente>`;
  }

  toXML(): string {
    const XML = `<BizAgiWSParam>
 <domain>${this.domain}</domain>
 <userName>${this.userName}</userName>
  <Cases>
   <Case>
	     <Process>${this.Process}</Process>
     <Entities>

     <Enrolamiento>
  <Cliente>
    <CorreoElectronicoEmpresa> ${
      this.CorreoElectronicoEmpresa || ""
    }</CorreoElectronicoEmpresa> 
    <TelefonoFijooMovilCont>${
      this.TelefonoFijooMovilCont || ""
    }</TelefonoFijooMovilCont>
  
  
    <NombreoRazonSocial>${this.NombreoRazonSocial || ""}</NombreoRazonSocial>
    <CorreoContactoComercial>${
      this.CorreoContactoComercial || ""
    }</CorreoContactoComercial>
    <Comuna entityName="Comuna">
      <Provincia entityName="Provincia">
        <CodProvincia>${this.CodProvincia || ""}</CodProvincia>
        <Region entityName="Region">
          <CodRegion>${this.CodRegion || ""}</CodRegion>
        </Region>
      </Provincia>
      <CodComuna>${this.CodComuna || ""}</CodComuna>
    </Comuna>
    <NombreContactoPrincipal>${
      this.NombreContactoPrincipal || ""
    }</NombreContactoPrincipal>
    <DireccionComercial>${this.DireccionComercial || ""}</DireccionComercial>
  
    <RutEmpresa>${this.RutEmpresa || ""}</RutEmpresa>
    <TelefonoFijooMovil>${this.TelefonoFijooMovil || ""}</TelefonoFijooMovil>
   
  </Cliente>
  <IdUsuarioSolicitante>${
    this.IdUsuarioSolicitante || ""
  }</IdUsuarioSolicitante>
</Enrolamiento>

     </Entities>
     </Case>
   </Cases>
  </BizAgiWSParam>`;
    return XML;
  }
}
