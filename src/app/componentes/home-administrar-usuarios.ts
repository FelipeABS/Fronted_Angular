import { Component, OnInit } from '@angular/core';

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';


@Component({

	selector: "home-adm-usuarios",
	templateUrl: "../vistas/home-adm-usuarios.html",
	providers: [ServicioUsuarios]

})

export class HomeAdmUsuariosComponente {

	public identificado;
	public estadoToken:boolean = true;
	public usuario;

	constructor(private _serviciosUsuarios:ServicioUsuarios,public router: Router,private toastr: ToastrService) {
		this.identificado = localStorage.getItem("id");
		this.usuario = JSON.parse(localStorage.getItem("usuario"));
		this.comprobarToken()
	}

	comprobarToken(){
	  this._serviciosUsuarios.confirmarToken(this.identificado).subscribe(
	  	resultado => {
	  		this.estadoToken = true
	  	},
	  	error => {
	  		this.estadoToken = false
	  	})
	  
	}

	onAdmUsuarioNuevo(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/administrar/usuarioNuevo']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}
	onAdmUsuarioAdministrar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/administrar/usuarioAdministrar']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}
	oncuentaAdministrar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/administrar/cuentaAdministrar']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}

	onPerfilAdministrar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/administrar/perfilAdministrar']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}
	onGrupoNuevo(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/administrar/grupoNuevo']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}

	onGrupoAdministrar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/administrar/grupoAdministrar']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}
}