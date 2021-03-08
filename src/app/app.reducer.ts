import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/store/auth.reducer';
import * as region from './perfil/services/store/reducers/bizagi-regiones.reducers';
import * as provincia from './perfil/services/store/reducers/bizagi-provincias.reducers';
import * as comuna from './perfil/services/store/reducers/bizagi-comunas.reducers';
import * as Banco from './perfil/services/store/reducers/bizagi-banco.reducers';
import * as Cuenta from './perfil/services/store/reducers/bizagi-cuenta.reducers';
import * as Empresa from './auth/store/empresa.reducer';
import { EmpresaAsociada } from './models/User.models';



export interface AppState {
   ui: ui.State,
   user: auth.State,
   regiones:region.RegionState,
   provincias:provincia.ProvinciaState,
   comunas:comuna.ComunaState
   bancos:Banco.BancoState,
   tipoCuenta: Cuenta.CuentaState,
   empresa:Empresa.State
}

export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
   user: auth.authReducer,
   regiones:region.BizagiRegionReducer,
   provincias:provincia.BizagiProvinciaReducer,
   comunas:comuna.BizagiComunasReducer,
   bancos:Banco.BizagiBancoReducer,
   tipoCuenta: Cuenta.BizagiCuentaReducer,
   empresa:Empresa.empresaReducer
}