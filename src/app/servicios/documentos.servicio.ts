import { Injectable } from '@angular/core';

import { Http, Response, Headers } from '@angular/http';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { Ruta } from '../ruta_global';

@Injectable()

export class ServicioDocumentos{

	/*=============================================
	PETICIONES HTTP PARA TRAER EL ARCHIVO JSON
	=============================================*/

	public url:string;

	constructor(private _http:Http){

		this.url = Ruta.url;	
	
	}

	tomarDocumento(archivo,token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})
		return this._http.get(this.url+"tomar-archivo"+archivo,{headers: headers}).pipe(map(resultado => resultado.json()))	
	}

	crearDocumento(documento,url,token,archivo){
		if(!archivo){
			return new Promise(function(resolver, rechazar){
				rechazar("No hay Archivo para subir")
			})
		}else {
			return new Promise(function(resolver, rechazar){
			  var formData:any = new FormData();
			  var xhr = new XMLHttpRequest();
			  formData.append("archivo", archivo[0]);
			  formData.append("titulo", documento.titulo);
			  formData.append("descripcion", documento.descripcion);
			  formData.append("destinatario", documento.destinatario);
			  formData.append("grupoDestino", documento.grupoDestino);
			  formData.append("confirmarPendiente", documento.confirmarPendiente);
			  formData.append("fechaCreacion", documento.fechaCreacion);
			  formData.append("creadorID", documento.creadorID);

			  xhr.onreadystatechange = function (){
			  	if(xhr.readyState == 4){
			  		if(xhr.status == 200){
			  			resolver(JSON.parse(xhr.response))
			  		}else {
			  			rechazar(xhr.response)
			  		}
			  	}
			  }
			  xhr.open("POST",url, true);
			  xhr.setRequestHeader("Authorization", token);
			  xhr.send(formData);
			})
		}
	}

	confirmarToken(token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
		return this._http.get(this.url+"confirmartoken", {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ObtenerDocumentos(token,id){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})		
		return this._http.get(this.	url+"mostrar-documentos", {headers: headers}).pipe(map(resultado => resultado.json()))
	}
	ObtenerTodosDocumentos(token,id){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})		
		return this._http.get(this.	url+"mostrar-todos-documentos", {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ActualizarDocumento(url,documento,token,archivo,usuariosOriginales){
		if(!archivo){
			return new Promise(function(resolver, rechazar){
			  var formData:any = new FormData();
			  var xhr = new XMLHttpRequest();
			  formData.append("titulo", documento.titulo);
			  formData.append("descripcion", documento.descripcion);
			  formData.append("actualizarArchivo", 0);
			  formData.append("rutaArchivoActual", documento.archivo);
			  formData.append("destinatario", documento.destinatario);
			  formData.append("grupoDestino", documento.grupoDestino);
			  formData.append("confirmarPendiente", documento.confirmarPendiente);
			  formData.append("fechaCreacion", documento.fechaCreacion);
			  formData.append("creadorID", documento.creadorID);
			  formData.append("usuariosOriginales", usuariosOriginales);

			  xhr.onreadystatechange = function (){
			  	if(xhr.readyState == 4){
			  		if(xhr.status == 200){
			  			resolver(JSON.parse(xhr.response))
			  		}else {
			  			rechazar(xhr.response)
			  		}
			  	}
			  }
			  xhr.open("PUT",url, true);
			  xhr.setRequestHeader("Authorization", token);
			  xhr.send(formData);
			})
		}else {
			return new Promise(function(resolver, rechazar){
			  var formData:any = new FormData();
			  var xhr = new XMLHttpRequest();
			  formData.append("archivo", archivo[0]);
			  formData.append("titulo", documento.titulo);
			  formData.append("descripcion", documento.descripcion);
			  formData.append("actualizarArchivo", 1);
			  formData.append("rutaArchivoActual", documento.archivo);

			  xhr.onreadystatechange = function (){
			  	if(xhr.readyState == 4){
			  		if(xhr.status == 200){
			  			resolver(JSON.parse(xhr.response))
			  		}else {
			  			rechazar(xhr.response)
			  		}
			  	}
			  }
			  xhr.open("PUT",url, true);
			  xhr.setRequestHeader("Authorization", token);
			  xhr.send(formData);
			  
			})
		}
	}

	aceptarDocumento(iddoc,token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})		
		return this._http.get(this.url+"aceptar-documento/"+iddoc, {headers: headers}).pipe(map(resultado => resultado.json()))
	}
	rechazarDocumento(iddoc,token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})		
		return this._http.get(this.url+"rechazar-documento/"+iddoc, {headers: headers}).pipe(map(resultado => resultado.json()))
	}
	BorrarDocumento(id, token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})		
		return this._http.delete(this.url+"borrar-documento/"+id, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

}