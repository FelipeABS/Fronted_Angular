import { Component, OnInit } from '@angular/core';

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { ListaUsuarios } from "../modelos/login.modelo";

import { Ruta } from '../ruta_global';

import { ToastrService } from 'ngx-toastr';

import { ChangeDetectorRef } from '@angular/core';

import * as $ from 'jquery';

import 'datatables.net';

import 'datatables.net-bs4';



@Component({
	selector: "app-grupo-nuevo",
	templateUrl: "../vistas/grupo-nuevo.html",
	providers: [ServicioUsuarios],
	styleUrls: ['../../assets/estilos/grupo_nuevo.scss']
})

export class grupoNuevoComponente {

	public usuarios:any; //Modelo Documento
	public identificado; //Para almacenar token en Storage
	public url:string;
	public preloader:boolean = true;
	public estadoToken:boolean = true;
	public TituloGrupo = '';
	public nuevoGrupo;
    public Usuarios;
	public contador:number = 0;
	dataTable: any;
	public GrupoUsuarios: any[] = [];
	public GrupoTem: any[] = [];
	public tipos = [
    {value: 'adm', viewValue: 'Administrador'},
    {value: 'esp', viewValue: 'Especialista'},
    {value: 'jsec', viewValue: 'Jefe de Sector'},
    {value: 'admces', viewValue: 'Administradora del Cesfam'}
  	];
  	public Grupo;

	constructor(private _serviciosUsuarios:ServicioUsuarios, private toastr: ToastrService, private chRef: ChangeDetectorRef) {
		this.url = Ruta.url;
		this.identificado = localStorage.getItem("id");
		this.usuarios = JSON.parse(localStorage.getItem("usuario"));
		this._serviciosUsuarios.ObtenerUsuarios(this.identificado).subscribe(
			resultado => {
			  this.Usuarios = resultado;
			  this.chRef.detectChanges();
		      // Now you can use jQuery DataTables :
		      const table_usuario: any = $('table');
		      this.dataTable = table_usuario.DataTable( {
				    "scrollX": true,
		            "order": [[1, "desc"]],
		            "stateSave": true,
		            "language": {
		              "url": "./../../assets/base/dataTables.spanish.lang.json"
		            },
		            "columns": [
		                {"width": "20%", "className": "text-center"},
		                {"width": "25%", "className": "text-center"},
		                {"width": "25%", "className": "text-center"},
		                {"width": "30%", "className": "text-center"},
		            ]
				});
			  this.preloader = false     	      
			},
			error => {
				var errorMensaje = (error._body)
		})
		this._serviciosUsuarios.ObtenerGrupo(this.identificado).subscribe(
			resultado => {
				this.Grupo = resultado.mostrandoGrupo[0];
			},
			error =>{
				this.toastr.error('Error al Obtener Grupo!', 'Error',{
	 			closeButton: true
	 			});
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
	agregarUsuario (nombre, apellido, rut, id, tipo) {
        this.GrupoTem.push({
          Nombre: nombre,
          Apellido: apellido,
          Rut: rut
        })
        this.GrupoUsuarios.push({
          Iduser: id,
          tipoCuenta: tipo
        })
        this.contador += 1
    }
    mostrarBoton(){
    	if(this.contador > 0){
    		return true
    	}else {
    		return false 
    	}
    }
    agregarGrupo() {
     var contador = 0
     if (this.TituloGrupo != '') {
     	  for(var i=0;i<this.GrupoUsuarios.length;i++){
     	  	if(this.GrupoUsuarios[i].tipoCuenta == 'sec' || this.GrupoUsuarios[i].tipoCuenta == 'jsec' || this.GrupoUsuarios[i].tipoCuenta == 'admces'){
     	  		contador += 1
     	  	}
     	  }
     	  if(contador > 1 && this.usuarios.cuentaID.tipo=='esp' || contador > 1 && this.usuarios.cuentaID.tipo=='jsec'){
     	  	this.toastr.warning('Debes seleccionar una sola Cuenta de nivel Superior', 'Error',{
			closeButton: true
			});
     	  }else{
     	  	let newgrupo = {
	          titulo: this.TituloGrupo,
	          usuarios: this.GrupoUsuarios.slice()
	          }
	          this.Grupo.grupos.push(newgrupo)          
	          this._serviciosUsuarios.ActualizarGrupo(this.Grupo, this.identificado).subscribe(
	          	resultado => {
	          		this._serviciosUsuarios.ObtenerGrupo(this.identificado).subscribe(
						resultado => {
						this.Grupo = resultado.mostrandoGrupo[0];
						this.toastr.success('Grupo Agregado!', 'Respuesta',{
			 				closeButton: true
			 				});
						},
						error =>{
							this.toastr.error('Error al Obtener Grupo !', 'Error',{
			 				closeButton: true
			 				});
						})
	          	},
	          	error=> {
	          		this.toastr.error('Error al Crear Grupo!', 'Error',{
		 				closeButton: true
		 				});
	          })
	          this.TituloGrupo = ''
	          this.GrupoUsuarios = []
	          this.GrupoTem = []
	      }
        } else {
          this.toastr.error('Debe ingresar un Titulo!', 'Titulo',{
			closeButton: true
			});
      }
    }
    eliminar (indice) {
	    this.GrupoUsuarios.splice(indice, 1)
	    this.GrupoTem.splice(indice, 1)
	    this.contador -= 1
    }
    mostrar (id) {
    for (var i = this.GrupoUsuarios.length - 1; i >= 0; i--) {
     if (this.GrupoUsuarios[i].Iduser == id) {
      return false
     }
    }
     return true
    }
}