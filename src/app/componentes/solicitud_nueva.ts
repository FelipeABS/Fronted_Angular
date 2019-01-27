import { Component, OnInit } from '@angular/core';

import { ServicioDocumentos } from "../servicios/documentos.servicio";

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { Documentos } from "../modelos/documento.modelo";

import { Ruta } from '../ruta_global';

import { ToastrService } from 'ngx-toastr';

import { Select2OptionData } from 'ng2-select2';

import * as $ from 'jquery';

import 'select2';


@Component({
	selector: "app-solicitud-nueva",
	templateUrl: "../vistas/solicitud-nueva.html",
	providers: [ServicioDocumentos,ServicioUsuarios],
	styleUrls: ['../../assets/estilos/solicitud_nueva.scss']
})

export class solicitudNuevaComponente {

	public documento:Documentos; //Modelo Documento
	public usuario;
	public subirDocumento: Array<File>;
	public identificado; //Para almacenar token en Storage
	public url:string;
	public estadoToken:boolean = true;
	public exampleData: Array<Select2OptionData>;
    public options: Select2Options;
    public value: string[];
    public current: string;
    public preloader:boolean = false;
    public Grupos;
    public Usuarios;

	constructor(private _serviciosDocumentos:ServicioDocumentos,private _serviciosUsuarios:ServicioUsuarios, private toastr: ToastrService) {
		this.documento = new Documentos ("","","",[],[],[],[],[],"","");
		this.url = Ruta.url;
		this.identificado = localStorage.getItem("id");
		this.usuario = JSON.parse(localStorage.getItem("usuario"));
		this.comprobarToken()
	}



	ngOnInit(){
    this._serviciosUsuarios.ObtenerGrupo(this.identificado).subscribe(
		resultado => {
			this.Grupos = resultado.mostrandoGrupo[0].grupos
		    $(() => {
			  $('.multipleGroup').select2({
			  	placeholder: 'Selecciona el/los Grupo'
			  });
			});
		},
		error => {
			this.toastr.warning('Error al Obtener los grupos!', 'Error',{
				closeButton: true
			});
		})
    this._serviciosUsuarios.ObtenerUsuarios(this.identificado).subscribe( 
    	resultado => {
    	    this.Usuarios = resultado.mostrandoUsuarios
    	    $(() => {
			  $('.multipleUsuarios').select2({
			  	placeholder: 'Selecciona el/los destinatarios'
			  });
			});
	    },
	    error => {
	    	this.toastr.warning('Error al Obtener los usuarios', 'Error',{
				closeButton: true
			});
	    })
	}


	comprobarToken(){
	  this._serviciosDocumentos.confirmarToken(this.identificado).subscribe(
	  	resultado => {
	  		this.estadoToken = true
	  		this.identificado = resultado.token;
			localStorage.setItem("id", this.identificado);
	  	},
	  	error => {
	  		this.estadoToken = false
	  	})
	}
	nuevoDocumento(){
		var contador = 0
		this.preloader = true
		this.comprobarToken()
		if(this.estadoToken == true){
			var Destinatario: any = $('.multipleUsuarios').val()
			var GrupoDestinarios:any = $('.multipleGroup').val()
			if(this.documento.titulo == ''){
			  this.toastr.warning('Debe Ingresar un Titulo', 'Error',{
				closeButton: true
			  });
			}else if(this.documento.descripcion == ''){
				this.toastr.warning('Debe Ingresar una Descripcion', 'Error',{
				closeButton: true
			  });
			}else if(Destinatario.length <= 0 && GrupoDestinarios.length <= 0){
				this.toastr.warning('Debe Seleccionar algun Destinatario', 'Error',{
				closeButton: true
			  	});
			}else if(this.subirDocumento == null){
				this.toastr.warning('Debe cargar alguna solicitud', 'Error',{
				closeButton: true
			  	});
			}else if(this.subirDocumento[0].type != "application/pdf"){
				this.toastr.warning('Debe cargar solicitud en pdf', 'Error',{
				closeButton: true
			  	});
			}else{
				for (var i = 0; i< Destinatario.length;i+=1){
					var SpitDestino = Destinatario[i].split(",")
					if(SpitDestino[1]=='sec'||SpitDestino[1]=='jsec'||SpitDestino[1]=='admces'){
						contador++
					}
					this.documento.destinatario.push({
						usuarioID: SpitDestino[0]
					})
				}
				for (var i = 0; i< GrupoDestinarios.length;i+=1){
					this.documento.grupoDestino.push({
						nombreGrupo: GrupoDestinarios[i]
					})
					for(var j=0;j<this.Grupos.length;j+=1){
						if(GrupoDestinarios[i]==this.Grupos[j].titulo){
							for(var k=0;k<this.Grupos[j].usuarios.length;k+=1){
							  if(this.Grupos[j].usuarios[k].tipoCuenta == 'sec'||this.Grupos[j].usuarios[k].tipoCuenta == 'jsec'||this.Grupos[j].usuarios[k].tipoCuenta == 'admces'){
							  	contador++
							  }
							}
						}
					}
				}
				if(contador <= 1){
				  this.documento.destinatario = JSON.stringify(this.documento.destinatario)
				this.documento.grupoDestino = JSON.stringify(this.documento.grupoDestino)
				this.documento.confirmarPendiente = [];			
				this.documento.fechaCreacion = new Date();
				this.documento.creadorID = this.usuario._id;
				this._serviciosDocumentos.crearDocumento(this.documento,this.url+"crear-documento",this.identificado, this.subirDocumento).then(
				(resultado) => {				
					this.documento.titulo = "";
					this.documento.descripcion = "";
					this.documento.destinatario = []
					this.documento.grupoDestino = []
					this.documento.archivo = null;
					this.toastr.success('Solicitud Enviada!', 'Respuesta');
					this.preloader = false
					$('#destinatario').val(null).trigger('change');
					$('#gruposDestino').val(null).trigger('change');
				},
				(error)=>{
					this.toastr.error('No se logro enviar la solicitud', 'Error');
				}

				)
				}else{
				  this.toastr.warning('Debe seleccionar una cuenta de nivel Superior', 'Sesion Expirada',{
						closeButton: true
					});
				}
				
				
			}

		}else{
			this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
			});
		}
		this.preloader = false
	}

	cargarFichero(fileInput: any){
		this.subirDocumento = <Array<File>>fileInput.target.files;
		if(this.subirDocumento[0].type != "application/pdf"){
			this.toastr.warning('Formato no Aceptado!', 'Error',{
				closeButton: true
			});
		}else{
		  return this.subirDocumento;
		}		
	}
	
}