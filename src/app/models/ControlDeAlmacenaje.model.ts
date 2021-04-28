export class ReservadePosicionesClass {
  ControlDeAlmacenaje: number;
  Standar?: number;
  CantidadRequerida?: number;
  CodigodeEstandar?: number;
  TipodeTarifa?: number;
  ObservacionesAdicionales?: string;
  key?: string;
}

export class ListadodeHorasDisponiblesClass {
  CantidadReservada: number;
  FechadeIngreso: string;
  Seleccionado: boolean;
  Tramosdisponibles: string;
  key?: string;
}

export class ListadodeHorasParaRetiroClass {
  CantidadReservada: number;
  FechadeIngreso: string;
  Seleccionado: boolean;
  Tramosdisponibles: string;
  key?: string;
}

export class DetalledeUbicacionesDis {
  SeleccionarRetiro: boolean;
  key?: string;
}

export class ControlDeAlmacenaje {
  public domain: string = "";
  public idCase: string;
  public userName: string = "";
  public Process: string = "";
  public CodFrecuencia: string = "";
  public DeclaraquenocontieneM: string = "";
  public Cliente: string = "";
  public NumerodeTramosaSolicit: string = "";
  public NumerodeCaso: string = "";
  public FechaHoraCorte: string = "";
  public OrdendeRetiro: string = "";
  public FechaHoraRetiro: string = "";
  public OrdendeIngreso: string = "";
  public FechaHoraIngreso: string = "";
  public CodigoQR: string = "";
  public ReservadePosiciones: ReservadePosicionesClass[] = [];
  public ListadodeHorasDisponibl: ListadodeHorasDisponiblesClass[] = [];
  public ListadodeHorasParaRetiroClass: ListadodeHorasParaRetiroClass[] = [];
  public DetalledeUbicacionesDis: DetalledeUbicacionesDis[] = [];
  public banco: string = "";
  public tipoPago: string = "";
  public tipoCuenta: string = "";
  public numCuenta: string = "";
  constructor() {}

  toXMLCreateInitialCase(): string {
    return `<BizAgiWSParam>
        <domain>${this.domain}</domain>
        <userName>${this.userName}</userName>
         <Cases>
          <Case>
        <Process>${this.Process}</Process>
        <Entities>
        <ControlDeAlmacenaje>
        <Cliente entityName="Cliente" key='${this.Cliente}'> 
         </Cliente>
        </ControlDeAlmacenaje>
        </Entities>
        </Case>
      </Cases>
     </BizAgiWSParam>`;
  }

  toXmlFullCase(): string {
    return `<ControlDeAlmacenaje>
       
        <DeclaraquenocontieneM>${this.DeclaraquenocontieneM}</DeclaraquenocontieneM>
        </ControlDeAlmacenaje>`;
  }

  private ListadoHorasReservadaXML(): string {
    var xml = "";
    this.ListadodeHorasDisponibl.forEach((tramo) => {
      if (tramo.key != null && tramo.key != undefined) {
        xml =
          xml +
          `
                <ListadodeHorasDisponibles key="${tramo.key}">
                <CantidadReservada>${tramo.CantidadReservada}</CantidadReservada>
					<FechadeIngreso>${tramo.FechadeIngreso}</FechadeIngreso>
					<Seleccionado>${tramo.Seleccionado}</Seleccionado>
					<Tramosdisponibles>${tramo.Tramosdisponibles}</Tramosdisponibles>
                </ListadodeHorasDisponibles>
                `;
      } else {
        xml =
          xml +
          `
                <ListadodeHorasDisponibles>
                <CantidadReservada>${tramo.CantidadReservada}</CantidadReservada>
					<FechadeIngreso>${tramo.FechadeIngreso}</FechadeIngreso>
					<Seleccionado>${tramo.Seleccionado}</Seleccionado>
					<Tramosdisponibles>${tramo.Tramosdisponibles}</Tramosdisponibles>
                </ListadodeHorasDisponibles>
                `;
      }
    });

    return xml;
  }

  private ListadoHorasParaRetiroXML(): string {
    var xml = "";
    this.ListadodeHorasParaRetiroClass.forEach((listado) => {
      xml =
        xml +
        `
                <ListadodeHorasparaRetiro>
                    <Seleccionar>${listado.Seleccionado}</Seleccionar>
				    <TramosdeRetiro>${listado.Tramosdisponibles}</TramosdeRetiro>
				    <FechadeRetiro>${this.FechaHoraRetiro}</FechadeRetiro>
				</ListadodeHorasparaRetiro>
                `;
    });

    return xml;
  }

  private ListadoUbicDisponibleParaRetiroXML(): string {
    var xml = "";
    this.DetalledeUbicacionesDis.forEach((listado) => {
      xml =
        xml +
        `
                <DetalledeUbicacionesDisp key='${listado.key}'>
                    <SeleccionarRetiro>${listado.SeleccionarRetiro}</SeleccionarRetiro>
				</DetalledeUbicacionesDisp>
                `;
    });

    return xml;
  }

  private ReservaPosicionXML(): string {
    var xml = "";
    this.ReservadePosiciones.forEach((reserva) => {
      if (reserva.key != null && reserva.key != "") {
        xml =
          xml +
          ` <ReservadePosiciones entityName='ReservadePosiciones' key='${reserva.key}'>  
             
                <CantidadRequerida>${reserva.CantidadRequerida}</CantidadRequerida> 
                <CodigodeEstandar>${reserva.CodigodeEstandar}</CodigodeEstandar>   
                <TipodeTarifa>${reserva.TipodeTarifa}</TipodeTarifa>   
                <ObservacionesAdicionales>${reserva.ObservacionesAdicionales}</ObservacionesAdicionales>   
                </ReservadePosiciones> `;
      } else {
        xml =
          xml +
          ` <ReservadePosiciones>  
                 
                <CantidadRequerida>${reserva.CantidadRequerida}</CantidadRequerida> 
                <CodigodeEstandar>${reserva.CodigodeEstandar}</CodigodeEstandar>   
                <TipodeTarifa>${reserva.TipodeTarifa}</TipodeTarifa>   
                <ObservacionesAdicionales>${reserva.ObservacionesAdicionales}</ObservacionesAdicionales>   
                </ReservadePosiciones> `;
      }
    });

    return xml;
  }

  toXMLUpdateCase(): string {
    return `<BizAgiWSParam>
        <Entities>
        <ControlDeAlmacenaje entityName='ControlDeAlmacenaje' key='${
          this.idCase
        }'>

   <DeclaraquenocontieneM>${this.DeclaraquenocontieneM}</DeclaraquenocontieneM>
            <FechaHoraIngreso>${this.FechaHoraIngreso}</FechaHoraIngreso>
            <NumerodeCuenta>${this.numCuenta}</NumerodeCuenta>
            <ReservadePosiciones>
                ${this.ReservaPosicionXML()}
            </ReservadePosiciones>

            <TipodeCuenta entityName="TipodeCuenta">
                <CodTipodeCuenta>${this.tipoCuenta || ""}</CodTipodeCuenta>
            </TipodeCuenta>

            <Banco entityName="Banco">
              <CodBanco>${this.banco || ""}</CodBanco>
            </Banco>

            <TipodePago entityName="TipodePago">
                <Cod>${this.tipoPago}</Cod>
            </TipodePago>

            <ListadodeHorasDisponibl>
                ${this.ListadoHorasReservadaXML()}
            </ListadodeHorasDisponibl>
        </ControlDeAlmacenaje>
        </Entities>
     </BizAgiWSParam>`;
  }

  toXMLUpdateRetiroCase(): string {
    return `<BizAgiWSParam>
        <Entities>
        <ControlDeAlmacenaje entityName='ControlDeAlmacenaje' key='${
          this.idCase
        }'>
        <FechaHoraRetiro>${this.FechaHoraRetiro}</FechaHoraRetiro>

        <ListadodeHorasparaReti>
            ${this.ListadoHorasParaRetiroXML()}
        </ListadodeHorasparaReti>

        <DetalledeUbicacionesDis>
        ${this.ListadoUbicDisponibleParaRetiroXML()}
    </DetalledeUbicacionesDis>

        
        </ControlDeAlmacenaje>
        </Entities>
     </BizAgiWSParam>`;
  }
}
