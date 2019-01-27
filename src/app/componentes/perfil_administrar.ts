import { Component, OnInit } from '@angular/core';

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { ServicioCuentas } from "../servicios/cuentas.servicio";

import { ListaUsuarios } from "../modelos/login.modelo";

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import * as $ from 'jquery';

import { Ruta } from '../ruta_global';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({

	selector: "app-perfil-administrar",
	templateUrl: "../vistas/perfil-administrar.html",
	providers: [ServicioUsuarios,ServicioCuentas],
	styleUrls: ['../../assets/estilos/perfil_administrar.scss']

})

export class PerfilComponente {

	public identificado;
	public usuarios:ListaUsuarios;
	public estadoToken:boolean = true;
    public newpassword:string;
	public oldpassword:string;
	public passwordText:string;
	public subirFoto: Array<File>;
	public url:string;
	public recibirFotoPerfil:boolean = false;
	public foto;
	
	constructor(private _serviciosUsuarios:ServicioUsuarios,private _serviciosCuentas:ServicioCuentas,private sanitizer: DomSanitizer, public router: Router,private toastr: ToastrService) { 
		this.identificado = localStorage.getItem("id");
		this.usuarios = JSON.parse(localStorage.getItem("usuario"));
		this.comprobarToken()
		this.url = Ruta.url;
		if(this.usuarios != null){
		  var Rutaimagen = this.usuarios.imagenPerfilRuta
		  var imagenSplit = Rutaimagen.split("/")
		  var idImagen = imagenSplit[4]
		  this.foto = this.sanitizer.bypassSecurityTrustResourceUrl(this.url+'tomar-foto/'+idImagen);
		}
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

	onActualizarPerfil(){
		this.comprobarToken()
		if(this.estadoToken == true){ 
			if(this.usuarios.Nombre != ''){
				if(this.usuarios.Apellido_Paterno != ''){
					if(this.usuarios.Apellido_Materno != ''){
						if(this.usuarios.Rut != '' && this.usuarios.Rut.length == 9){
						  if(this.usuarios.Cesfam != ''){
							  if(this.usuarios.Sector != ''){ 	
							  	this._serviciosUsuarios.ActualizarPerfilUsuario(this.usuarios,this.identificado).subscribe(	
									resultado => {
										this._serviciosUsuarios.ObtenerUsuario(this.identificado).subscribe(
											resultado => {
												  this.usuarios = resultado.mostrandoUsuario[0];
												  this.identificado = resultado.token;
											      localStorage.setItem("id", this.identificado);
											      localStorage.setItem("usuario", JSON.stringify(this.usuarios));
												  this.toastr.success('Cambio Realizado!', 'Respuesta');
											},
											error => {
												this.toastr.error('No se logro actualizar el Perfil', 'Error');
											})
									},
									error => {
										this.toastr.error('No se logro actualizar el Perfil', 'Error');
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
	onCambiarPass(){
		if(this.newpassword == this.passwordText && this.newpassword != null){
		this.comprobarToken()
		if(this.estadoToken == true){
			this._serviciosCuentas.cambiarPass(this.usuarios.cuentaID,this.newpassword,this.passwordText,this.oldpassword,this.identificado).subscribe(	
				resultado => {
					this.newpassword = '';
					this.passwordText = '';
					this.oldpassword = '';
					this.toastr.success('Contraseña Cambiada', 'Respuesta');
				},
				error => {
					var errorMensaje = JSON.parse(error._body).mensaje
					this.toastr.error(errorMensaje, 'Error');
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
	obtenerFoto(){
	    return this.foto;
	}

	OnClick(){
      $("#file").trigger("click");
	}
	cambiarFoto(fileInput: any){
	  this.comprobarToken()
	  if(this.estadoToken == true){
	  this.subirFoto = <Array<File>>fileInput.target.files;
	  //Modificar Ruta en this.usuarios y luego enviarlo de momento aun no
	  if(this.subirFoto[0].type == 'image/png' || this.subirFoto[0].type == 'image/jpg' || this.subirFoto[0].type == 'image/jpeg' || this.subirFoto[0].type == 'image/gif'){
	  	this._serviciosUsuarios.cambiarFoto(this.usuarios,this.url+"actualizar-fotoPerfil",this.identificado,this.subirFoto).then(
	  	(resultado) => {
	  	  this._serviciosUsuarios.ObtenerUsuario(this.identificado).subscribe(
				resultado => {
				 this.usuarios = resultado.mostrandoUsuario[0];
				 if(this.usuarios != null){
				  var Rutaimagen = this.usuarios.imagenPerfilRuta
				  var imagenSplit = Rutaimagen.split("/")
				  var idImagen = imagenSplit[4]
				  this.foto = this.sanitizer.bypassSecurityTrustResourceUrl(this.url+'tomar-foto/'+idImagen);
				 }
			     localStorage.setItem("usuario", JSON.stringify(this.usuarios));
				 this.toastr.success('Cambio realizado!', 'Respuesta',{closeButton: true});
				},error => {
				  this.toastr.error('No se pudo cambiar la foto de perfil!', 'Error',{closeButton: true
				  });
			  })
	  	},
	  	(error) => {
	  	  this.toastr.success('Error al intentar cambiar la foto', 'Error');
	  	})
	  }else{
		this.toastr.warning('Formato del archivo no soportado', 'Formato Incorrecto',{
			closeButton: true
		});
	  }
	}else {
		this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
			closeButton: true
		});
	}
    }
	ngOnInit(){}	
}