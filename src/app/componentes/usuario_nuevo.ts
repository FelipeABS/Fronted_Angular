import { Component, OnInit } from '@angular/core';

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { ListaUsuarios } from "../modelos/login.modelo";

import { RutValidator } from 'ng2-rut';

import { Ruta } from '../ruta_global';

import { ToastrService } from 'ngx-toastr';



@Component({
	selector: "app-usuario-nuevo",
	templateUrl: "../vistas/usuario-nuevo.html",
	providers: [ServicioUsuarios],
	styleUrls: ['../../assets/estilos/usuarios_nuevo.scss']
})

export class usuarioNuevoComponente {

	public usuarios:ListaUsuarios; //Modelo Documento
	public identificado; //Para almacenar token en Storage
	public url:string;
	public estadoToken:boolean = true;
	public preloader:boolean = false;
	public tipos = [
    {value: 'adm', viewValue: 'Administrador'},
    {value: 'esp', viewValue: 'Especialista'},
    {value: 'sec', viewValue: 'Secretaria'},
    {value: 'jsec', viewValue: 'Jefe de Sector'},
    {value: 'admces', viewValue: 'Administradora del Cesfam'}
  	];

	constructor(private _serviciosUsuarios:ServicioUsuarios, private toastr: ToastrService) {
		this.usuarios = new ListaUsuarios("","","","","","","","","","","",[],[],"");
		this.url = Ruta.url;	
		this.identificado = localStorage.getItem("id");
		this.comprobarToken()
	}

	ngOnInit(){}

	comprobarToken(){
	  this._serviciosUsuarios.confirmarToken(this.identificado).subscribe(
	  	resultado => {
	  		this.estadoToken = true
	  		this.identificado = resultado.token;
			localStorage.setItem("id", this.identificado);
	  	},
	  	error => {
	  		this.estadoToken = false
	  	})
	}
	nuevoUsuario(){
		this.preloader = true
		this.comprobarToken()
		if(this.estadoToken == true){
			if(this.usuarios.usuario != ''){
				if(this.usuarios.password != ''){
					if(this.usuarios.tipo != ''){
						if(this.usuarios.Nombre != ''){
							if(this.usuarios.Apellido_Paterno != ''){
								if(this.usuarios.Apellido_Materno != ''){
									if(this.usuarios.Rut != '' && this.usuarios.Rut.length == 9){
									  if(this.usuarios.Cesfam != ''){
										  if(this.usuarios.Sector != ''){
												this._serviciosUsuarios.crearUsuario(this.usuarios,this.identificado).subscribe(
												resultado => {
													this.usuarios.usuario = "";
													this.usuarios.password = "";
													this.usuarios.tipo = "";
													this.usuarios.Nombre = "";
													this.usuarios.Apellido_Paterno = "";
													this.usuarios.Apellido_Materno = "";
													this.usuarios.Rut = "";
													this.usuarios.Cesfam = "";
													this.usuarios.Sector = "";
													this.toastr.success('Usuario Ingresado!', 'Respuesta',{
													closeButton: true
													});
													this.preloader = false
												},
												error=>{
													var mensajeError = JSON.parse(error._body).mensaje
													this.toastr.error(mensajeError, 'Error');
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
										this.toastr.warning('Debe Ingresar un RUT valido', 'Falta Informacion',{
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
					}else{
						this.toastr.warning('Debe seleccionar un tipo de cuenta', 'Falta Informacion',{
						closeButton: true
						});
					}
				}else{
					this.toastr.warning('Debe Ingresar una contraseña', 'Falta Informacion',{
					closeButton: true
					});
				}
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
		this.preloader = false;
		
	}
}