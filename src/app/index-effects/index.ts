import {BizagiRegionEffects} from '../perfil/services/store/effects/bizagi-region.effects';
import {BizagiProvinciaEffects} from '../perfil/services/store/effects/bizagi-provincia.effects';
import {BizagiComunaEffects} from '../perfil/services/store/effects/bizagi-comuna.effects';
import {BizagiBancoEffects} from '../perfil/services/store/effects/bizagi-banco.effects';
import {BizagiTipoCuentaEffects} from '../perfil/services/store/effects/bizagi-cuenta.effects';
import {BizagiUbicacionesEffects} from '../storage/services/store/effects/bizagi.ubicacion.effects';
import {CreacionCasoInicialEffects} from '../storage/services/store/effects/crearcasoinicial.effects';
import {BizagiEstandarEffects} from '../storage/services/store/effects/bizagi.estandar.effects';
import {BizagiTarifaEffects} from '../storage/services/store/effects/bizagi.tarifa.effects';
import {BizagiTramoHorasEffects} from '../storage/services/store/effects/bizagi.tramohoras.effects';
import {BizagiFrecuenciaCobroEffects} from '../storage/services/store/effects/bizagi.frecuenciaCobro.effects';
import {PerformActivityInicialEffects} from '../storage/services/store/effects/bizagi.perform.effects';
import {BizagiParametrosEffects} from '../storage/services/store/effects/bizagi.parametros.effects';


export const EffectsArray: any[] = [
  BizagiFrecuenciaCobroEffects,
  BizagiEstandarEffects,
  BizagiTarifaEffects,
  BizagiTramoHorasEffects,
  CreacionCasoInicialEffects,
  BizagiUbicacionesEffects,
  BizagiRegionEffects,
  BizagiProvinciaEffects,
  BizagiComunaEffects,
  BizagiBancoEffects,
  BizagiTipoCuentaEffects,
  PerformActivityInicialEffects,
  BizagiParametrosEffects
];