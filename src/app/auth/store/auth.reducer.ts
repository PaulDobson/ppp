import { createReducer, on } from "@ngrx/store";
import * as acciones from "./auth.actions";
import { Usuario } from "../../models/User.models";

export interface State {
  user: Usuario;
}

export const initialState: State = {
  user: null,
};

const _authReducer = createReducer(
  initialState,

  on(acciones.setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(
    acciones.setEmpresaAsociada,
    (state, { rutEmpresa }) => (
      { ...state, user: { ...state.user, RutEmpresaFK: rutEmpresa } } )
  ),
  on(acciones.setHabilitadoParaServicio, (state, { habilitado }) => ({
    ...state,
    user: { ...state.user, habilitado: habilitado },
  })),
  on(acciones.unSetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state, action) {
  return _authReducer(state, action);
}
