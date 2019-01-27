import { Component, OnInit } from '@angular/core';

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { ListaUsuarios } from "../modelos/login.modelo";

import { Ruta } from '../ruta_global';

import { ChangeDetectorRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import * as $ from 'jquery';

import 'datatables.net';

import 'datatables.net-bs4';


@Component({
	selector: "app-usuario-administrar",
	templateUrl: "../vistas/usuario-administrar.html",
	providers: [ServicioUsuarios],
	styleUrls: ['../../assets/estilos/usuarios_administrar.scss']
})

export class usuarioAdministrarComponente {

	public usuarios:ListaUsuarios; //Modelo Documento
	public identificado; //Para almacenar token en Storage
	public url:string;
	public Usuarios;
	public preloader:boolean = true;
	public datos:boolean = true;
	dataTable: any;
	public idUsuario;
	public estadoToken:boolean = true;
	public formEditarUsuario:boolean = false; //Si cumple Requisitos

	constructor(private _serviciosUsuarios:ServicioUsuarios, private toastr: ToastrService, private chRef: ChangeDetectorRef) {
		this.usuarios = new ListaUsuarios("","","","","","","","","","","",[],[],"");
		this.url = Ruta.url;	
		this.identificado = localStorage.getItem("id");
		  this._serviciosUsuarios.ObtenerUsuarios(this.identificado).subscribe(
			resultado => {
			  this.Usuarios = resultado;
			  this.chRef.detectChanges();
		      // Now you can use jQuery DataTables :
		      const table: any = $('table');
		      this.dataTable = table.DataTable( {
				   "scrollX": true,
				    "order": [[1, "desc"]],
	        		"stateSave": true,
	        		"language": {
		            "url": "./../../assets/base/dataTables.spanish.lang.json"
		        	},
		        	"columns": [
			            {"width": "20%", "className": "text-center"},
			            {"width": "20%", "className": "text-center"},
			            {"width": "20%", "className": "text-center"},
			            {"width": "15%", "className": "text-center"},
			            {"width": "25%", "className": "text-center"}
			        ]
				});
			  this.preloader = false	      
			},
			error => {
				var errorMensaje = JSON.parse(error._body)
			})
		 this.comprobarToken()
		
	}

	ngOnInit(){}

	comprobarToken(){
	  this._serviciosUsuarios.confirmarToken(this.identificado).subscribe(
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
			if(this.usuarios.Nombre != ''){
				if(this.usuarios.Apellido_Paterno != ''){
					if(this.usuarios.Apellido_Materno != ''){
						if(this.usuarios.Rut != ''){
						  if(this.usuarios.Cesfam != ''){
							  if(this.usuarios.Sector != ''){
							  	this._serviciosUsuarios.ActualizarUsuario(this.usuarios,this.idUsuario,this.identificado).subscribe(	
									resultado => {
									  this._serviciosUsuarios.ObtenerUsuarios(this.identificado).subscribe(
										resultado => {
										  this.Usuarios = resultado;
										  this.toastr.success('Cambio Realizado!', 'Respuesta');      
										},
										error => {
											this.toastr.error('No se logro actualizar la tabla', 'Error');
											console.log (JSON.parse(error._body))
										})
									},
									error => {
										var error = JSON.parse(error._body)
										this.toastr.error(error.mensaje, 'Error');
									})
							  	}else{
									this.toastr.warning('Debe Ingresar un Sector', 'Falta Informacion',{
									closeButton: true
									});
								}
							}else{
								this.toastr.warning('Debe Ingresar un Cesfam de origen', 'Falta Informacion',{
								closeButton: true
								});
							}
						}else{
							this.toastr.warning('Debe Ingresar un RUT', 'Falta Informacion',{
							closeButton: true
							});
						}
					}else{
						this.toastr.warning('Debe Ingresar un Apellido Materno', 'Falta Informacion',{
						closeButton: true
						});
					}
				}else{
					this.toastr.warning('Debe Ingresar un Apellido Paterno', 'Falta Informacion',{
					closeButton: true
					});
				}
			}else{
				this.toastr.warning('Debe Ingresar un Nombre', 'Falta Informacion',{
				closeButton: true
				});
			}
			

		}else {
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			});
		}
	}

	onBorrar(){
		this.comprobarToken()
		if(this.estadoToken == true){
			this._serviciosUsuarios.BorrarUsuario(this.idUsuario,this.identificado).subscribe(
				resultado => {
					this._serviciosUsuarios.ObtenerUsuarios(this.identificado).subscribe(
					resultado => {
					  this.Usuarios = resultado;
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

	openModalActualizar(usuario){
	  this.idUsuario = usuario._id;
	  this.usuarios.Nombre = usuario.Nombre
	  this.usuarios.Apellido_Paterno = usuario.Apellido_Paterno;
	  this.usuarios.Apellido_Materno = usuario.Apellido_Materno;
	  this.usuarios.Rut = usuario.Rut;
	  this.usuarios.Cesfam = usuario.Cesfam;
	  this.usuarios.Sector = usuario.Sector;
	  this.usuarios.grupos = usuario.grupos;
	}
	openModalVista(usuario){
	  this.idUsuario = usuario._id;
	  this.usuarios.Nombre = usuario.Nombre
	  this.usuarios.Apellido_Paterno = usuario.Apellido_Paterno;
	  this.usuarios.Apellido_Materno = usuario.Apellido_Materno;
	  this.usuarios.Rut = usuario.Rut;
	  this.usuarios.Cesfam = usuario.Cesfam;
	  this.usuarios.Sector = usuario.Sector;
	  this.usuarios.grupos = usuario.grupos;
	}
	openModalEliminar(id){
	  this.idUsuario = id;
	}
}