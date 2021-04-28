// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  url_bizagi_we:'http://198.37.118.53/GESTION_PPP/webservices/workflowenginesoa.asmx',
  url_bizagi_em:'http://198.37.118.53/GESTION_PPP/webservices/entitymanagersoa.asmx',
  usuario_creador_caso:'pdobson',
  domain:'payperpallet.cl',
  key:'Fewrwerwe5gggjtut76ugfd.ppp28',
  taskIDEnrolamiento:'registrar',
  id_cantidadMaximaIngreso:1,
  id_cantidadMaximaRetiro:2,
  taskIDCompletarRegistro:'CompRegistro',
  proceso:'ControlDeAlmacenaje',
  taskIdSolicitarRetiro:'SolRetiro',
};
