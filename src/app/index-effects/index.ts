import {BizagiRegionEffects} from '../perfil/services/store/effects/bizagi-region.effects';
import {BizagiProvinciaEffects} from '../perfil/services/store/effects/bizagi-provincia.effects';
import {BizagiComunaEffects} from '../perfil/services/store/effects/bizagi-comuna.effects';
import {BizagiBancoEffects} from '../perfil/services/store/effects/bizagi-banco.effects';
import {BizagiTipoCuentaEffects} from '../perfil/services/store/effects/bizagi-cuenta.effects';
 
export const EffectsArray: any[] = [ BizagiRegionEffects,BizagiProvinciaEffects,BizagiComunaEffects , BizagiBancoEffects,BizagiTipoCuentaEffects];