import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/store/auth.reducer';
import * as region from './perfil/services/store/reducers/bizagi-regiones.reducers';
import * as provincia from './perfil/services/store/reducers/bizagi-provincias.reducers';
import * as comuna from './perfil/services/store/reducers/bizagi-comunas.reducers';
import * as Banco from './perfil/services/store/reducers/bizagi-banco.reducers';
import * as Cuenta from './perfil/services/store/reducers/bizagi-cuenta.reducers';
import * as Empresa from './auth/store/empresa.reducer';
import * as Ubicaciones from './storage/services/store/reducers/bizagi.ubicacion.reducers';
import * as CasoSolicitud from './storage/services/store/reducers/crearcasoinicial.reducers';
import * as Estandar from './storage/services/store/reducers/bizagi.estandar.reducers';
import * as Tarifa from './storage/services/store/reducers/bizagi.tarifa.reducers';
import * as Parametros from './storage/services/store/reducers/bizagi.parametros.reducers';
import * as TramoHoras from './storage/services/store/reducers/bizagi.tramohoras.reducers';
import * as FrecuenciaCobro from './storage/services/store/reducers/bizagi.frecuenciaCobro.reducers';
import * as ActualizacionCaso from './storage/services/store/reducers/actualizarcaso.reducers';
import * as PerformActivityRegistro from './storage/services/store/reducers/bizagi.perform.reducers';
export interface AppState {
   ui: ui.State,
   user: auth.State,
   regiones:region.RegionState,
   provincias:provincia.ProvinciaState,
   comunas:comuna.ComunaState
   bancos:Banco.BancoState,
   tipoCuenta: Cuenta.CuentaState,
   empresa:Empresa.EmpresaState,
   ubicaciones:Ubicaciones.UbicacionesState,
   ubicacionesCaso:Ubicaciones.UbicacionesState,
   actualizacionUbicaciones:Ubicaciones.UbicacionesState,
   registroSolicitud: CasoSolicitud.CasoIngresoInicialtate,
   estandar:Estandar.EstandarState,
   tramohoras:TramoHoras.TramoHorasState,
   tarifa:Tarifa.TarifaState,
   frecuenciaCobro:FrecuenciaCobro.FrecuenciaCobroState,
   actualizarcaso:ActualizacionCaso.CasoIngresoUpdateInicialtate,
   performRegistro:PerformActivityRegistro.PerformActivityState,
   parametros:Parametros.ParametrosState
}

export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
   user: auth.authReducer,
   regiones:region.BizagiRegionReducer,
   provincias:provincia.BizagiProvinciaReducer,
   comunas:comuna.BizagiComunasReducer,
   bancos:Banco.BizagiBancoReducer,
   tipoCuenta: Cuenta.BizagiCuentaReducer,
   empresa:Empresa.empresaReducer,
   ubicaciones:Ubicaciones.BizagiUbicacionesReducer,
   actualizacionUbicaciones:Ubicaciones.BizagiActualizacionUbicacionesReducer,
   registroSolicitud:CasoSolicitud.CasoSolicitudReducer,
   estandar:Estandar.BizagiEstandarReducer,
   tarifa:Tarifa.BizagiTarifaReducer,
   tramohoras:TramoHoras.BizagiTramoHorasReducer,
   frecuenciaCobro:FrecuenciaCobro.BizagiTFrecuenciaCobroReducer,
   actualizarcaso:ActualizacionCaso.ActualizarCasoSolicitudReducer,
   performRegistro:PerformActivityRegistro.BizagiPerformActivityReducer,
   ubicacionesCaso:Ubicaciones.BizagiUbicacionesCasoReducer,
   parametros:Parametros.BizagiParametrosReducer
}