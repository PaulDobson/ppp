import { createAction, props } from "@ngrx/store";
import { BizAgiWSResponse } from "../../../../models/entidades.bizagi.models";

// ESTANDAR UBICACIONES

export const cargarEstandar = createAction(
  "[Estandar  Entity] cargar Estandar"
);
export const cargarEstandarSuccess = createAction(
  "[Estandar Entity] cargar Estandar Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarEstandarError = createAction(
  "[Estandar Entity] cargar Estandar Error",
  props<{ payload: any }>()
);

//TARIFAS
export const cargarTarifa = createAction("[Tarifa  Entity] cargar Tarifa");

export const cargarTarifaSuccess = createAction(
  "[Tarifa Entity] cargar Tarifa Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarTarifaError = createAction(
  "[Tarifa Entity] cargar Tarifa Error",
  props<{ payload: any }>()
);

//Frecuencia de cobro
export const cargarFrecuenciaCobro = createAction(
  "[Frecuencia Cobro Entity] cargar Frecuencia Cobro"
);

export const cargarFrecuenciaCobroSuccess = createAction(
  "[Frecuencia Cobro Entity] cargar Frecuencia Cobro Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarFrecuenciaCobroError = createAction(
  "[Frecuencia Cobro Entity] cargar Frecuencia Cobro Error",
  props<{ payload: any }>()
);

//TRAMO HORAS
export const cargarTramoHoras = createAction(
  "[TramoHoras  Entity] cargar TramoHoras"
);
export const cargarTramoHorasSuccess = createAction(
  "[TramoHoras Entity] cargar TramoHoras Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarTramoHorasError = createAction(
  "[TramoHoras Entity] cargar TramoHoras Error",
  props<{ payload: any }>()
);

//Parametros Sistema

export const cargarParametrosSistema = createAction(
  "[Parametros Entity] cargar Parametros Sistema"
 
);

export const cargarParametrosSistemaSuccess = createAction(
  "[Parametros Entity] cargar Parametros Sistema Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const cargarParametrosSistemaError = createAction(
  "[Parametros Entity] cargar Parametros Sistema Error",
  props<{ payload: any }>()
);


//CREACION CASOS
export const crearCasoInicial = createAction(
  "[Registro Solicitud] crear caso inicial",
  props<{ xml: string }>()
);

export const crearCasoInicialSuccess = createAction(
  "[Registro Solicitud] crear caso inicial Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);

export const crearCasoInicialError = createAction(
  "[Registro Solicitud] crear caso inicial Error",
  props<{ payload: any }>()
);

export const actualizarCaso = createAction(
  "[Registro Solicitud] actualizar caso",
  props<{ xml: string }>()
);

export const actualizarCasoInicialSuccess = createAction(
  "[Registro Solicitud] actualizar caso Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);

export const actualizarCasoInicialError = createAction(
  "[Registro Solicitud] actualizar Error",
  props<{ payload: any }>()
);

export const getCaseByRutEmpresa = createAction(
  "[Registro Solicitud] Obtiene Caso Por Rut Empresa",
  props<{ idCliente: string }>()
);

//Perform activity
export const PerformActivity = createAction(
  "[Caso] Perform Activity Registro",
  props<{ idCase: string; taskName: string }>()
);

export const PerformActivityError = createAction(
  "[Caso] Perform Activity Registro Error",
  props<{ payload: any }>()
);

export const PerformActivitySuccess = createAction(
  "[Caso] Perform Activity Registro Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);

//Ubicaciones reservadas para X dia
export const obtenerUbicacionXDia = createAction(
  "[Ubicacion Entity] cargar Ubicacion por dia",
  props<{ filtro: string }>()
);

export const obtenerUbicacionXDiaSuccess = createAction(
  "[Ubicacion Entity] cargar Ubicacion por dia Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const obtenerUbicacionXDiaError = createAction(
  "[Ubicacion Entity] cargar Ubicacion por dia Error",
  props<{ payload: any }>()
);

export const obtenerUbicacionCaso = createAction(
  "[Ubicacion Entity] cargar Ubicacion por Caso",
  props<{ filtro: string }>()
);
export const obtenerUbicacionCasoSuccess = createAction(
  "[Ubicacion Entity] cargar Ubicacion por Caso Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const obtenerUbicacionCasoError = createAction(
  "[Ubicacion Entity] cargar Ubicacion por Caso Error",
  props<{ payload: any }>()
);

export const actualizarUbicacion = createAction(
  "[Ubicacion Entity] Actualizar ubicacion",
  props<{ filtro: string }>()
);

export const actualizarUbicacionSuccess = createAction(
  "[Ubicacion Entity] Actualizar ubicacion Success",
  props<{ bizagiResponse: BizAgiWSResponse }>()
);
export const actualizarUbicacionError = createAction(
  "[Ubicacion Entity] Actualizar ubicacion Error",
  props<{ payload: any }>()
);
