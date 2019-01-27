import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { Ruta } from '../ruta_global';

@Component({

	selector: "app-navbar",
	templateUrl: "../vistas/navbar.html",
	providers: []

})

export class NavBarComponente {

	public identificado; //Para almacenar id en Storage
	public usuario; // Para almacenar el usuario en el Storage
    public url:string;
    public estadoFoto:boolean = false;
    public foto;


	constructor(public router: Router,private sanitizer: DomSanitizer){
		this.identificado = localStorage.getItem("id");
		this.usuario = JSON.parse(localStorage.getItem("usuario"));
		this.url = Ruta.url;
		if(this.usuario != null){
		  var Rutaimagen = this.usuario.imagenPerfilRuta
		  var imagenSplit = Rutaimagen.split("/") 
		  var idImagen = imagenSplit[4]
		  this.foto = this.sanitizer.bypassSecurityTrustResourceUrl(this.url+'tomar-foto/'+idImagen);
		}
	}

	ngOnInit(){
	}

	cerrarSesion(){

		localStorage.removeItem("id");
		localStorage.removeItem("usuario");
		localStorage.clear();
		this.identificado = null;
		this.usuario = null;
		this.router.navigate(['/index']);	

	}
	configuracion(){
		this.router.navigate(['/administrar/perfilAdministrar']);
	}

	obtenerFoto(){
		return this.foto;
	}
}
