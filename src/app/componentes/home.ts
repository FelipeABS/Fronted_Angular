import { Component, OnInit } from '@angular/core';

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({

	selector: "home",
	templateUrl: "../vistas/home.html",
	providers: [ServicioUsuarios]

})

export class HomeComponente {

	public identificado;
	public estadoToken:boolean = true;
	public usuario;
	
	constructor(private _serviciosUsuarios:ServicioUsuarios,public router: Router,private toastr: ToastrService) { 
		this.identificado = localStorage.getItem("id");
		this.usuario = JSON.parse(localStorage.getItem("usuario"));
		this._serviciosUsuarios.ObtenerUsuario(this.identificado).subscribe( 
			resultado => {
			  this.usuario = resultado.mostrandoUsuario[0]
			},
			error => {

		})
		this.comprobarToken();
		console.log(this.usuario);
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

	ngOnInit(){}

	onNuevaSolicitud(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/nuevaSolicitud']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}
	onSeguimientoSolicitud(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/seguimientoSolicitud']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}
	onAdministrar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/administrar']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}

	onPendienteSolicitud(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this.router.navigate(['/pendientesSolicitud']);
		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			}); 
		}
	}
	
}