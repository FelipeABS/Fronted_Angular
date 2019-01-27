import { Component, OnInit } from '@angular/core';

import { ListaUsuarios } from "../modelos/login.modelo";

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';


@Component({

	selector: "index",
	templateUrl: "../vistas/index.html",
	providers: [ServicioUsuarios],
	styleUrls: ['../../assets/estilos/index.scss']

})

export class IndexComponente {

	public identificado; //Para almacenar id en Storage
	public usuario; // Para almacenar el usuario en el Storage
	public listaUsuarios:ListaUsuarios; //Modelo para Logearse
	public validarIngreso:boolean = false; // En caso que el ingreso sea fallido se usara como variable
	public mensaje = 'mensaje'; //Mensaje que retorne la apiRest


	constructor(private _servicioUsuarios:ServicioUsuarios, public router: Router, private toastr: ToastrService){

		this.listaUsuarios = new ListaUsuarios("","","","","","","","","","","",[],[],"");
		localStorage.clear();

	}

	ngOnInit(){}

	onSubmit(){
		this._servicioUsuarios.login(this.listaUsuarios, "true").subscribe(
			resultado => {
				this.identificado = resultado.token;
				this.usuario = resultado.infoUsuario;
				localStorage.setItem("id", this.identificado);
				localStorage.setItem("usuario", this.usuario);
				this.router.navigate(['/inicio']);

			},
			error => {
				var errorMensaje = JSON.parse(error._body)
				this.mensaje = errorMensaje.mensaje;
				this.toastr.warning(this.mensaje , 'Datos Incorrectos',{
	 			closeButton: true
	 			});

			}

		)

	}
}
