import { Component, OnInit } from '@angular/core';

import { ServicioCuentas } from "../servicios/cuentas.servicio";

import { ListaUsuarios } from "../modelos/login.modelo";

import { Ruta } from '../ruta_global';

import { ChangeDetectorRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import * as $ from 'jquery';

import 'datatables.net';

import 'datatables.net-bs4';

@Component({
	selector: "app-cuentas-administrar",
	templateUrl: "../vistas/cuentas-administrar.html",
	providers: [ServicioCuentas],
	styleUrls: ['../../assets/estilos/cuentas_administrar.scss']
})

export class cuentasAdministrarComponente {

	public usuarios:ListaUsuarios; //modelodelo Documento
	public identificado; //Para almacenar token en Storage
	public url:string;
	public preloader:boolean = true;
	public Cuentas;
	dataTable: any;
	public newPassword;
	public passwordText;
	public idCuenta;
	public estadoToken:boolean = true;
	public formEditarUsuario:boolean = false; //Si cumple Requisitos
	public tipos = [
    {value: 'adm', viewValue: 'Administrador'},
    {value: 'esp', viewValue: 'Especialista'},
    {value: 'jsec', viewValue: 'Jefe de Sector'},
    {value: 'admces', viewValue: 'Administradora del Cesfam'}
  	];

	constructor(private _serviciosCuentas:ServicioCuentas, private toastr: ToastrService, private chRef: ChangeDetectorRef) {
		this.usuarios = new ListaUsuarios("","","","","","","","","","","",[],[],"");
		this.url = Ruta.url;	
		this.identificado = localStorage.getItem("id");
		  this._serviciosCuentas.ObtenerCuentas(this.identificado).subscribe(
			resultado => {

			  this.Cuentas = resultado;
			  this.chRef.detectChanges();
		      const table: any = $('table');
		      this.dataTable = table.DataTable( {
			    "scrollX": true,
			    "order": [[1, "desc"]],
        		"stateSave": true,
        		"language": {
	            "url": "./../../assets/base/dataTables.spanish.lang.json"
	        	},
	        	"columns": [
		            {"width": "30%", "className": "text-center"},
		            {"width": "30%", "className": "text-center"},
		            {"width": "40%", "className": "text-center"}
		        ]
			  });
			  this.preloader = false     	      
			},
			error => {
				var errorMensaje = (error._body)
			})
		 this.comprobarToken()
		
	}

	ngOnInit(){}

	comprobarToken(){
	  this._serviciosCuentas.confirmarToken(this.identificado).subscribe(
	  	resultado => {
	  		this.identificado = resultado.token;
			localStorage.setItem("id", this.identificado);
	  		this.estadoToken = true
	  	},
	  	error => {
	  		this.estadoToken = false
	  	})
	}
	onActualizar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			if(this.usuarios.usuario != ''){
				this._serviciosCuentas.ActualizarCuentas(this.usuarios,this.idCuenta,this.identificado).subscribe(	
				resultado => {
				  this._serviciosCuentas.ObtenerCuentas(this.identificado).subscribe(
					resultado => {
					  this.Cuentas = resultado;
					  this.toastr.success('Cambio Realizado!', 'Respuesta');      
					},
					error => {
						this.toastr.error('No se logro actualizar la tabla', 'Error');
						var errorMensaje = JSON.parse(error._body)
					})
				},
				error => {
					this.toastr.error('No se logro actualizar el archivo', 'Error');
				})
			}else{
				this.toastr.warning('Debe Ingresar un Usuario', 'Falta Informacion',{
				closeButton: true
				});
			}
		}else {
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			});
		}
	}
	onActualizarPass(){
		if(this.newPassword == this.passwordText && this.newPassword != null){
		this.comprobarToken()
		if(this.estadoToken == true){
			this._serviciosCuentas.cambiarPassAdmin(this.idCuenta,this.newPassword,this.passwordText,this.identificado).subscribe(	
				resultado => {
				  this._serviciosCuentas.ObtenerCuentas(this.identificado).subscribe(
					resultado => {
				      this.newPassword = '';
				      this.passwordText = '';
					  this.Cuentas = resultado;
					  this.toastr.success('Cambio Realizado!', 'Respuesta');      
					},
					error => {
						this.toastr.error('No se logro actualizar la tabla', 'Error');
						var errorMensaje = JSON.parse(error._body)
					})
				},
				error => {
					this.toastr.error('No se logro actualizar el archivo', 'Error');
				}
			)
		}else {
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			});
		}	
		}else{
			this.toastr.error('Las contraseñas no coinciden!', 'Error',{
				closeButton: true
			});
		}
	}

	onBorrar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this._serviciosCuentas.BorrarCuentas(this.idCuenta,this.identificado).subscribe(
				resultado => {
					this._serviciosCuentas.ObtenerCuentas(this.identificado).subscribe(
					resultado => {
					  this.Cuentas = resultado;
					  this.toastr.success('Usuario Eliminado!', 'Respuesta');      
					},
					error => {
						this.toastr.error('No se logro actualizar la tabla', 'Error');
						var errorMensaje = JSON.parse(error._body)
					})
				},
				error => {
					this.toastr.error('No se logro eliminar el usuario', 'Error');				
				}
			)
		}else {
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			});
		}
	}

	openModalActualizar(cuenta){
	  this.idCuenta = cuenta._id;
	  this.usuarios.usuario = cuenta.usuario
	  this.usuarios.tipo = cuenta.tipo;
	}

	openModalActualizarPass(cuenta){
	  this.idCuenta = cuenta._id;
	}

	openModalEliminar(id){
	  this.idCuenta = id;
	}
}