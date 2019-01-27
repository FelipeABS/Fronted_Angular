import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';

import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from "@angular/common";

import { DataTablesModule } from 'angular-datatables';

import { HttpClientModule } from '@angular/common/http';

import { Select2Module } from 'ng2-select2';

import { Ng2Rut, RutValidator } from 'ng2-rut';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './componentes/not-found404'

import { IndexComponente } from './componentes/index'

import { HomeComponente } from './componentes/home'

import { HomeAdmUsuariosComponente } from './componentes/home-administrar-usuarios'

import { usuarioNuevoComponente } from './componentes/usuario_nuevo'

import { usuarioAdministrarComponente } from './componentes/usuario_administrar'

import { cuentasAdministrarComponente } from './componentes/cuentas_administrar'

import { solicitudPendienteComponente } from './componentes/solicitud_pendiente'

import { PerfilComponente } from './componentes/perfil_administrar'

import { grupoNuevoComponente} from './componentes/grupo_nuevo'

import { grupoAdministrarComponente} from './componentes/grupo_administrar'

import { NavBarComponente } from './componentes/navbar'

import { solicitudSeguimientoComponente } from './componentes/solicitud_seguimiento'

import { solicitudNuevaComponente } from './componentes/solicitud_nueva'

import { routing, appRoutingProviders } from './app.rutas';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule,MatExpansionModule,MatIconModule,MatGridListModule,MatDividerModule,MatToolbarModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatTableModule,MatPaginatorModule,MatSortModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponente,
    IndexComponente,
    NavBarComponente,
    solicitudSeguimientoComponente,
    solicitudNuevaComponente,
    HomeAdmUsuariosComponente,
    usuarioNuevoComponente,
    usuarioAdministrarComponente,
    solicitudPendienteComponente,
    cuentasAdministrarComponente,
    PerfilComponente,
    grupoNuevoComponente,
    grupoAdministrarComponente,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    Ng2Rut,
    CommonModule,
    routing,
    HttpModule,
    FormsModule,
    Select2Module,
    HttpClientModule,
    ToastrModule.forRoot(),
    DataTablesModule,
    [BrowserAnimationsModule],
    [MatButtonModule,MatGridListModule,MatIconModule,MatDividerModule,MatExpansionModule,MatToolbarModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatAutocompleteModule,MatTableModule,MatPaginatorModule,MatSortModule]
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
