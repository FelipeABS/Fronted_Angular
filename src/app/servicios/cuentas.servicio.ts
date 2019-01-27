import { Injectable } from '@angular/core';

import { Http, Response, Headers } from '@angular/http';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { Ruta } from '../ruta_global';

@Injectable()

export class ServicioCuentas{

	/*=============================================
	PETICIONES HTTP PARA TRAER EL ARCHIVO JSON
	=============================================*/

	public url:string;

	constructor(private _http:Http){

		this.url = Ruta.url;	
	
	}
	confirmarToken(token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
		return this._http.get(this.url+"confirmartoken", {headers: headers}).pipe(map(resultado => resultado.json()))

	}
	ObtenerCuentas(token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	

		return this._http.get(this.url+"obtener-cuentas", {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	ActualizarCuentas(listaUsuarios, id, token){
		let parametros = JSON.stringify(listaUsuarios);
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})

		return this._http.put(this.url+"actualizar-cuenta/"+id, parametros, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	BorrarCuentas(id,token){
		let headers = new Headers({"Content-Type":"application/json","Authorization": token})	
			
		return this._http.delete(this.url+"borrar-cuenta/"+id, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	cambiarPass(id,newpass,password,oldpass,token){
	console.log(id._id);
	let parametros = { "newpass" : newpass, "password" : password, "oldpass" : oldpass};
	let headers = new Headers({"Content-Type":"application/json","Authorization": token})
	return this._http.put(this.url+"cambiar-pass/"+id._id, parametros, {headers: headers}).pipe(map(resultado => resultado.json()))
	}

	cambiarPassAdmin(id,newpass,password,token){
	let parametros = { "newpass" : newpass, "password" : password};
	let headers = new Headers({"Content-Type":"application/json","Authorization": token})
	return this._http.put(this.url+"cambiar-pass-admin/"+id, parametros, {headers: headers}).pipe(map(resultado => resultado.json()))
	}
	

}