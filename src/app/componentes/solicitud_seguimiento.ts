import { Component, OnInit } from '@angular/core';

import { ServicioDocumentos } from "../servicios/documentos.servicio";

import { Documentos } from "../modelos/documento.modelo";

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { ChangeDetectorRef } from '@angular/core';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { Ruta } from '../ruta_global';

import * as $ from 'jquery';

import 'datatables.net';

import 'datatables.net-bs4';

import 'select2';

@Component({
	selector: "app-solicitud-seguimiento",
	templateUrl: "../vistas/solicitud-seguimiento.html",
	providers: [ServicioDocumentos,ServicioUsuarios],
	styleUrls: ['../../assets/estilos/solicitud_seguimiento.scss']
})


export class solicitudSeguimientoComponente {

	public Documentos;
	public solicitud;
	dataTable: any;
	public preloader:boolean = true
	public documento:Documentos; //Modelo Documento
	public usuario:any;
	public subirDocumento: Array<File>;
	public identificado; //Para almacenar token en Storage
	public url:string;
	public idDocumento;
	public estadoToken:boolean = true;
	public formEditarDocumento:boolean = false; // Para mostrar mensaje que no cumple requisitos
	public cambiarDocumento:boolean = false;
	public Grupos; 
	public Usuarios;
	public usuariosOriginales;
	public porConfirmar: any[] = [];
	public confirmados:any[] = [];
	public rechazados:any[] = [];
	public urldoc:any = '';

	constructor(private _serviciosDocumentos:ServicioDocumentos,private _serviciosUsuarios:ServicioUsuarios, private chRef: ChangeDetectorRef, private sanitizer: DomSanitizer, private toastr: ToastrService) { 
		this.documento = new Documentos ("","","",[],[],[],[],[],"","");
		this.url = Ruta.url;
		this.identificado = localStorage.getItem("id");
		this.usuario = JSON.parse(localStorage.getItem("usuario"));
		this.comprobarToken()
		this._serviciosDocumentos.ObtenerDocumentos(this.identificado,this.usuario._id).subscribe(
			resultado => {
			  this.Documentos = resultado;
			  this.chRef.detectChanges();
		      // Now you can use jQuery DataTables :
		      const table: any = $('.tables'); 
		      this.dataTable = table.DataTable( {
			  	"scrollX": true,
	            "order": [[1, "desc"]],
	            "stateSave": true,
	            "language": {
	              "url": "./../../assets/base/dataTables.spanish.lang.json"
	            },
	            "columns": [
	                {"width": "10%", "className": "text-center"},
	                {"width": "10%", "className": "text-center"},
	                {"width": "10%", "className": "text-center"},
	                {"width": "10%", "className": "text-center"},
	                {"width": "10%", "className": "text-center"},
	                {"width": "15%", "className": "text-center"},
	                {"width": "10%", "className": "text-center"},
	                {"width": "25%", "className": "text-center"}
	            ]	    
			  });
			  this.preloader = false      
			},
			error => {
				var errorMensaje = (error._body)
			})
		
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
	    	this.toastr.warning('Error al Obtener los usuarios!', 'Error',{
				closeButton: true
			});
	    })
	}

	comprobarToken(){
	  this._serviciosDocumentos.confirmarToken(this.identificado).subscribe(
	  	resultado => {
	  		this.estadoToken = true
	  	},
	  	error => {
	  		this.estadoToken = false
	  	})
	}

	getSafeUrl(url) {
		if(url == this.urldoc){
			return this.solicitud
		}else{
		this.urldoc = url	
        this.solicitud = this.sanitizer.bypassSecurityTrustResourceUrl(this.url+'tomar-archivo/'+url);
        return this.solicitud
		}
    }
    ///////////////////////////////////////
    // Funcion Para Actualizar Documento //
    ///////////////////////////////////////
	actualizarDocumento(){
	  this.comprobarToken()
	  if(this.estadoToken == true) {
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
		}else if(this.subirDocumento == null && this.cambiarDocumento==true){
			this.toastr.warning('Debe cargar alguna solicitud', 'Error',{
			closeButton: true
		  	});
		}else{
			this.documento.destinatario = []
			this.documento.grupoDestino = []
			for (var i = 0; i< Destinatario.length;i++){
				this.documento.destinatario.push({
					usuarioID: Destinatario[i]
				})
			}
			for (var i = 0; i< GrupoDestinarios.length;i++){
				this.documento.grupoDestino.push({
					nombreGrupo: GrupoDestinarios[i]
				})
			}
			this.documento.destinatario = JSON.stringify(this.documento.destinatario)
			this.documento.grupoDestino = JSON.stringify(this.documento.grupoDestino)
		  	this._serviciosDocumentos.ActualizarDocumento(this.url+"actualizar-documento/"+this.idDocumento, this.documento, this.identificado, this.subirDocumento,this.usuariosOriginales).then(
		  	(resultado)=>{
		  		this._serviciosDocumentos.ObtenerDocumentos(this.identificado,this.usuario._id).subscribe(
				resultado => {
				  this.identificado = resultado.token;
			      localStorage.setItem("id", this.identificado);
				  this.Documentos = resultado;  
				  this.cambiarDocumento = false; 
				  this.toastr.success('Cambio Realizado!', 'Respuesta');   
				},
				error => {
					this.toastr.error('No se logro actualizar la tabla', 'Error');
					var errorMensaje = JSON.parse(error._body)
				})
		  	},
		  	(error)=>{
		  		this.toastr.error('No se logro actualizar el archivo', 'Error');
		  	})
		}
	  }else{
	  	this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
		});
	  }
	}
	borrarDocumento(){
	  this.comprobarToken()
	  if(this.estadoToken == true){
	  	this._serviciosDocumentos.BorrarDocumento(this.idDocumento,this.identificado).subscribe(
			resultado => {
				this._serviciosDocumentos.ObtenerDocumentos(this.identificado,this.usuario._id).subscribe(
				resultado => {
				  this.identificado = resultado.token;
				  localStorage.setItem("id", this.identificado);
				  this.Documentos = resultado;  
				  this.cambiarDocumento = false; 
				  this.toastr.success('Documento Eliminado!', 'Respuesta');   
				},
				error => {
					var errorMensaje = JSON.parse(error._body)
					this.toastr.error('No se logro actualizar la tabla', 'Error');
				})
			}, 
			error => {
			  
			  this.toastr.error('No se logro eliminar el archivo', 'Error');
			}
			)
	  }else{
	  	this.toastr.warning('Su Sesion ha expirado porfavor vuelva a iniciar Sesion!', 'Sesion Expirada',{
				closeButton: true
		});
	  }
	}
	openModalActualizar(archivo){
	  this.idDocumento = archivo._id;
	  this.documento.titulo = archivo.titulo;
	  this.documento.descripcion = archivo.descripcion;
	  this.documento.archivo = archivo.archivo;
	  this.documento.destinatario = archivo.destinatario;
	  this.documento.grupoDestino = archivo.grupoDestino;
	  /////////////////////////////////////////////////
	  // Para Rellenar los Usuarios Seleccionados // //
	  /////////////////////////////////////////////////
	  var usuariosDestinatarios: any[] = [];
	  for (var i = 0; i<archivo.destinatario.length;i++){
	  	usuariosDestinatarios.push(archivo.destinatario[i].usuarioID)
	  }
	  $('.multipleUsuarios').val(usuariosDestinatarios);
	  $('.multipleUsuarios').trigger('change');
	  ////////////////////////////////////////////
	  // Para Rellenas los Grupos seleccionados //
	  ////////////////////////////////////////////
	  var grupoDestino: any[] = [];
	  for (var i = 0; i<archivo.grupoDestino.length;i++){
	  	grupoDestino.push(archivo.grupoDestino[i].nombreGrupo)
	  }
	  $('.multipleGroup').val(grupoDestino);
	  $('.multipleGroup').trigger('change');
	  var gruposUsuario = this.usuario.grupos
	  /////////////////////////////////////////////////////////////////////
	  //Encontrar todo los Ids actuales del documento //
	  /////////////////////////////////////////////////////////////////////
      var idUsuarios = []
      for (var i = grupoDestino.length - 1; i >= 0; i--) {
        for (var j = gruposUsuario.length - 1; j >= 0; j--) {
          if(gruposUsuario[j].titulo == grupoDestino[i]){
            for (var z = gruposUsuario[j].usuarios.length - 1; z >= 0; z--) {
              idUsuarios.push(gruposUsuario[j].usuarios[z].Iduser)
            };
          }
        };
      };
      for (var i = usuariosDestinatarios.length - 1; i >= 0; i--) {
        if(idUsuarios.includes(usuariosDestinatarios[i]) == false){
          idUsuarios.push(usuariosDestinatarios[i])
        }
      };
      this.usuariosOriginales = JSON.stringify(idUsuarios);
      //idUsuarios posee todo los Id antes de actualizar
	  this.documento.confirmarPendiente = archivo.confirmarPendiente;
	  this.documento.fechaCreacion = archivo.fechaCreacion;
	  this.documento.creadorID = archivo.creadorID;
	}
	openModalVista(archivo){
	  this.documento.archivo = archivo;
	}
	openModalPendientes(archivo){
	 this.porConfirmar = []
      for(var i=0;i<archivo.porConfirmar.length;i++){
      	this._serviciosUsuarios.ObtenerNombre(archivo.porConfirmar[i].idUsuario,this.identificado).subscribe(
    		resultado => {
    			let usuario = {
    			  Nombre: resultado.mostrandoUsuario[0].Nombre+resultado.mostrandoUsuario[0].Apellido_Paterno+resultado.mostrandoUsuario[0].Apellido_Materno
    			}
    		  this.porConfirmar.push(usuario)
    		},
    		error => {
    			console.log(error)
    		}
    	)
      }
	 //this.porConfirmar = archivo.porConfirmar;
	}
	openModalEliminar(archivo){
	  this.idDocumento = archivo._id;
	}
	openModalConfirmados(archivo){
		this.confirmados = []
		for(var i=0;i<archivo.confirmados.length;i++){
      	this._serviciosUsuarios.ObtenerNombre(archivo.confirmados[i].idConfirmado,this.identificado).subscribe(
    		resultado => {
    			let usuario = {
    			  Nombre: resultado.mostrandoUsuario[0].Nombre+resultado.mostrandoUsuario[0].Apellido_Paterno+resultado.mostrandoUsuario[0].Apellido_Materno,
    			  fechaConfirmacion: archivo.confirmados[i-1].fechaConfirmacion
    			}
    		  this.confirmados.push(usuario)
    		},
    		error => {
    			console.log(error)
    		}
    	)
      }
	}
	openModalRechazados(archivo){
		this.rechazados = []
		for(var i=0;i<archivo.rechazados.length;i++){
      	this._serviciosUsuarios.ObtenerNombre(archivo.rechazados[i].idRechazado,this.identificado).subscribe(
    		resultado => {
    			let usuario = {
    			  Nombre: resultado.mostrandoUsuario[0].Nombre+resultado.mostrandoUsuario[0].Apellido_Paterno+resultado.mostrandoUsuario[0].Apellido_Materno,
    			  fechaRechazo: archivo.rechazados[i-1].fechaRechazo
    			}
    		  this.rechazados.push(usuario)
    		},
    		error => {
    			console.log(error)
    		}
    	)
      }
	}


	cargarFichero(fileInput: any){
		this.subirDocumento = <Array<File>>fileInput.target.files;
		//if(this.subirDocumento[0].size < 2000000 )
		return this.subirDocumento;
	}
}