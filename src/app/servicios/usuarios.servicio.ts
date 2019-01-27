import { Injectable } from '@angular/core';

import { Http, Response, Headers } from '@angular/http';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { Ruta } from '../ruta_global';

@Injectable()

export class ServicioUsuarios{

	/*=============================================
	PETICIONES HTTP PARA TRAER EL ARCHIVO JSON
	=============================================*/

	public url:string;

	constructor(private _http:Http){

		this.url = Ruta.url;	
	
	}

	login(listaUsuarios, tokens){
		//Se agrega nuevo propiedad
        listaUsuarios.token = tokens;
		//Cuando enviamos peticiones POST debemos declarar el tipo de contenido que vamos a enviar a través de la cabecera HTTP
        let parametros = JSON.stringify(listaUsuarios);
		let headers = new Headers({"Content-Type":"application/json"})

		return this._http.post(this.url+"login", parametros, {headers: headers}).pipe(map(resultado => resultado.json()))	

	}

	confirmarToken(token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
		return this._http.get(this.url+"confirmartoken", {headers: headers}).pipe(map(resultado => resultado.json()))

	}
	crearUsuario(listaUsuarios,token){
		let parametros = JSON.stringify(listaUsuarios);
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})
		
		return this._http.post(this.url+"crear-usuario", parametros, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ObtenerUsuarios(token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
		return this._http.get(this.url+"obtener-usuarios", {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ObtenerNombre(id,token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
		return this._http.get(this.url+"obtener-nombre/"+id, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ObtenerGrupo(token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
		return this._http.get(this.url+"obtener-grupo-usuarios", {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ActualizarGrupo(grupo,token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
		return this._http.put(this.url+"crear-actualizar-borrar-grupo", grupo ,{headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ActualizarUsuario(listaUsuarios, id, token){
		let parametros = JSON.stringify(listaUsuarios);
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})
		return this._http.put(this.url+"actualizar-usuario/"+id, parametros, {headers: headers}).pipe(map(resultado => resultado.json()))
	}
	ActualizarPerfilUsuario(listaUsuarios,token){
		let parametros = JSON.stringify(listaUsuarios);
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})

		return this._http.put(this.url+"actualizar-perfil-usuario", parametros, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	BorrarUsuario(id,token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})		
		return this._http.delete(this.url+"borrar-usuario/"+id, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ObtenerUsuario(token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})		
		return this._http.get(this.url+"obtener-usuario", {headers: headers}).pipe(map(resultado => resultado.json()))
	}
	ObtenerFoto(token,id){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})
		return this._http.get(this.	url+"tomar-foto/"+id, {headers: headers}).pipe(map(resultado => resultado.json()))
	}
	cambiarFoto(listaUsuario,url,token,fotoPerfil){
		let parametros = JSON.stringify(listaUsuario.imagenPerfilRuta);
		if(!fotoPerfil){
			return new Promise(function(resolver, rechazar){
				rechazar("No hay ninguna foto selecionada para subir")
			})
		}else {
			return new Promise(function(resolver, rechazar){
			  var formData:any = new FormData();
			  var xhr = new XMLHttpRequest();
			  formData.append("archivo", fotoPerfil[0]);
			  formData.append("usuario", parametros);
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

}