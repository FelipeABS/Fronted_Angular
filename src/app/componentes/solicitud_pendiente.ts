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

@Component({
	selector: "app-solicitud-pendiente",
	templateUrl: "../vistas/solicitud-pendiente.html",
	providers: [ServicioDocumentos,ServicioUsuarios],
	styleUrls: ['../../assets/estilos/solicitud_pendiente.scss']
})


export class solicitudPendienteComponente {


	Documentos: any[] = [];
	dataTable: any;
	public documento:Documentos; //Modelo Documento
	public usuario:any;
	public solicitud;
	public preloader:boolean = true;
	public subirDocumento: Array<File>;
	public identificado; //Para almacenar token en Storage
	public url:string;
	public idDocumento;
	public estadoToken:boolean = true;
	public formEditarDocumento:boolean = false; // Para mostrar mensaje que no cumple requisitos
	public cambiarDocumento:boolean = false;
	public Grupos;
	public Usuarios;
	public urldoc:any = '';

	constructor(private _serviciosDocumentos:ServicioDocumentos,private _serviciosUsuarios:ServicioUsuarios, private chRef: ChangeDetectorRef, private sanitizer: DomSanitizer, private toastr: ToastrService) { 
		this.documento = new Documentos ("","","",[],[],[],[],[],"","");
		this.url = Ruta.url;
		this.identificado = localStorage.getItem("id");
		this.usuario = JSON.parse(localStorage.getItem("usuario"));
		this.comprobarToken()
		this._serviciosUsuarios.ObtenerUsuario(this.identificado).subscribe(
			resultado =>{
			  this.usuario = resultado.mostrandoUsuario[0]
			  this._serviciosDocumentos.ObtenerTodosDocumentos(this.identificado,this.usuario._id).subscribe(
				resultado => {
				  this.identificado = resultado.token;
				  localStorage.setItem("id", this.identificado);
				  for(var i=0; i<this.usuario.avisos.length;i++){
				  	for(var j = 0; j<resultado.mostrandoDocumentos.length;j++){
				  	  if(this.usuario.avisos[i].idDocumento == resultado.mostrandoDocumentos[j]._id){
				  	  	this.Documentos.push(resultado.mostrandoDocumentos[j])
				  	  }
				  	}
				  }
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
			                {"width": "15%", "className": "text-center"},
			                {"width": "15%", "className": "text-center"},
			                {"width": "20%", "className": "text-center"},
			                {"width": "15%", "className": "text-center"},
			                {"width": "35%", "className": "text-center"}
			            ]
				  });
				  this.preloader = false     	      
				},
				error => {
					var errorMensaje = (error._body)
				})
			},
			error =>{

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

	aceptarSolicitud(iddoc){
		this._serviciosDocumentos.aceptarDocumento(iddoc,this.identificado).subscribe(
			resultado=>{
				this._serviciosUsuarios.ObtenerUsuario(this.identificado).subscribe(
				resultado =>{
				  this.usuario = resultado.mostrandoUsuario[0]
				  this._serviciosDocumentos.ObtenerTodosDocumentos(this.identificado,this.usuario._id).subscribe(
					resultado => {
					  this.Documentos = []
					  for(var i=0; i<this.usuario.avisos.length;i++){
					  	for(var j = 0; j<resultado.mostrandoDocumentos.length;j++){
					  	  if(this.usuario.avisos[i].idDocumento == resultado.mostrandoDocumentos[j]._id){
					  	  	this.Documentos.push(resultado.mostrandoDocumentos[j])
					  	  }
					  	}
					  }      
					},
					error => {
						var errorMensaje = (error._body)
					})
				},
				error =>{

			})
				this.toastr.success('Solicitud Aceptada!', 'Respuesta');   
			},
			error=>{
				console.log(error)
			}
		)
	}

	rechazarSolicitud(iddoc){
		this._serviciosDocumentos.rechazarDocumento(iddoc,this.identificado).subscribe(
			resultado=>{
				this._serviciosUsuarios.ObtenerUsuario(this.identificado).subscribe(
				resultado =>{
				  this.usuario = resultado.mostrandoUsuario[0]
				  this._serviciosDocumentos.ObtenerTodosDocumentos(this.identificado,this.usuario._id).subscribe(
					resultado => {
					  this.Documentos = []
					  for(var i=0; i<this.usuario.avisos.length;i++){
					  	for(var j = 0; j<resultado.mostrandoDocumentos.length;j++){
					  	  if(this.usuario.avisos[i].idDocumento == resultado.mostrandoDocumentos[j]._id){
					  	  	this.Documentos.push(resultado.mostrandoDocumentos[j])
					  	  }
					  	}
					  }      
					},
					error => {
						var errorMensaje = (error._body)
					})
				},
				error =>{

			})
				this.toastr.error('Solicitud Rechazada!', 'Respuesta');   
			},
			error=>{
				console.log(error)
			}
		)
	}

	openModalVista(archivo){
	  this.documento.archivo = archivo;
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
}