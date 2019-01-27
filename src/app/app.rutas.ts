import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponente } from "./componentes/index";
import { HomeComponente } from "./componentes/home";
import { solicitudSeguimientoComponente } from "./componentes/solicitud_seguimiento";
import { solicitudNuevaComponente } from "./componentes/solicitud_nueva";
import { HomeAdmUsuariosComponente } from './componentes/home-administrar-usuarios';
import { usuarioNuevoComponente } from './componentes/usuario_nuevo';
import { usuarioAdministrarComponente } from './componentes/usuario_administrar';
import { cuentasAdministrarComponente } from './componentes/cuentas_administrar';
import { PerfilComponente } from './componentes/perfil_administrar';
import { grupoNuevoComponente} from './componentes/grupo_nuevo';
import { grupoAdministrarComponente} from './componentes/grupo_administrar';
import { solicitudPendienteComponente} from './componentes/solicitud_pendiente';
import { PageNotFoundComponent } from './componentes/not-found404';

const appRoutes: Routes = [

	{path: "", component: IndexComponente},
	{path: "index", component: IndexComponente},
	{path: "inicio", component: HomeComponente},
	{path: "seguimientoSolicitud", component: solicitudSeguimientoComponente},
	{path: "nuevaSolicitud", component: solicitudNuevaComponente},
	{path: "administrar", component: HomeAdmUsuariosComponente},
	{path: "administrar/usuarioNuevo", component: usuarioNuevoComponente},
	{path: "administrar/usuarioAdministrar", component: usuarioAdministrarComponente},
	{path: "administrar/cuentaAdministrar", component: cuentasAdministrarComponente},
	{path: "administrar/perfilAdministrar", component: PerfilComponente},
	{path: "administrar/grupoNuevo", component: grupoNuevoComponente},
	{path: "administrar/grupoAdministrar", component: grupoAdministrarComponente},
	{path: "pendientesSolicitud", component: solicitudPendienteComponente},
	{ path: '**', component: PageNotFoundComponent }

];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);