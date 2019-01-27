import { Component, OnInit } from '@angular/core';

import { ServicioUsuarios } from "../servicios/usuarios.servicio";

import { Ruta } from '../ruta_global';

import { ChangeDetectorRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import * as $ from 'jquery';

import 'datatables.net';

import 'datatables.net-bs4';


@Component({
	selector: "app-grupo-administrar",
	templateUrl: "../vistas/grupo-administrar.html",
	providers: [ServicioUsuarios],
	styleUrls: ['../../assets/estilos/grupo_administrar.scss']
})

export class grupoAdministrarComponente {

	public usuarios; //Modelo Documento
	public identificado; //Para almacenar token en Storage
	public url:string;
  public preloader:boolean = true;
	Grupos: any[];
	dataTable: any;
	public idUsuario;
	public estadoToken:boolean = true;
	public estadoTabla:boolean = false;
	public GrupoUsuarios: any[] = [];
	public GrupoTem: any[] = [];
	public indice;
	public DatoUsuarios: any[] = [];
	public tituloModal:string;
	public TituloGrupo:string;
  public contador;

	constructor(private _serviciosUsuarios:ServicioUsuarios, private toastr: ToastrService, private chRef: ChangeDetectorRef) {
		this.usuarios = JSON.parse(localStorage.getItem("usuario"))
		this.url = Ruta.url;	
		this.identificado = localStorage.getItem("id");

		 this._serviciosUsuarios.ObtenerGrupo(this.identificado).subscribe(
			resultado => {
			  this.Grupos = resultado.mostrandoGrupo[0].grupos;
			  this.chRef.detectChanges();
		      // Now you can use jQuery DataTables :
		      const table: any = $('#table');
		      this.dataTable = table.DataTable( {
				    "scrollX": true,
            "order": [[1, "desc"]],
            "stateSave": true,
            "language": {
              "url": "./../../assets/base/dataTables.spanish.lang.json"
            },
            "columns": [
                {"width": "30%", "className": "text-center"},
                {"width": "30%", "className": "text-center"},
                {"width": "40%", "className": "text-center"}
            ]
				  });
          this.preloader = false	      
			},
			error => {
				var errorMensaje = JSON.parse(error._body)
			})

		 this._serviciosUsuarios.ObtenerUsuarios(this.identificado).subscribe(
		 	resultado => {
		 		this.DatoUsuarios = resultado.mostrandoUsuarios;
		 	},
		 	error => {
		 		this.toastr.error('Error al obtener informacion de los Usuarios!', 'Error',{
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

	verIntegrantes(id, titulo, usuarios) {
	  this.GrupoTem = []
      for (var i = usuarios.length - 1; i >= 0; i--) {
        for (var j = this.DatoUsuarios.length - 1; j >= 0; j--) {
          if (usuarios[i].Iduser == this.DatoUsuarios[j]._id){ 
            this.GrupoTem.push({
              Nombre : this.DatoUsuarios[j].Nombre, //-> Usuario BD
              Apellido : this.DatoUsuarios[j].Apellido_Paterno,
              Rut : this.DatoUsuarios[j].Rut
            })
           }
         }
       }
       this.tituloModal = titulo
    }

    abrirModalEliminar (indice) {
      this.indice = indice
    }

    borrarGrupo() {
       this.Grupos.splice(this.indice, 1)
       let nuevoGrupo = {
         grupos : this.Grupos.slice()
       }
       this._serviciosUsuarios.ActualizarGrupo(nuevoGrupo,this.identificado).subscribe(
       	resultado => {
       		this.identificado = resultado.token;
    			localStorage.setItem("id", this.identificado);
           		this.toastr.success('Grupo Eliminado!', 'Respuesta',{
    				closeButton: true
    			});
           	},
           	error => {
           		this.toastr.error('No se ha podido borrar el grupo!', 'Error',{
    				closeButton: true
    			});
           	})
           this.indice = ''
        }

 	abrirModalactualizar(indice, titulo, usuarios) {
      for (var i = usuarios.length - 1; i >= 0; i--) {
        for (var j = this.DatoUsuarios.length - 1; j >= 0; j--) {
          //DatoUsuario -> Todo los usuarios de la BD
          //Usuario -> Dato de cada usuario de la bd
          if (usuarios[i].Iduser == this.DatoUsuarios[j]._id){ 
            this.GrupoTem.push({
              Nombre : this.DatoUsuarios[j].Nombre, //-> Usuario BD
              Apellido : this.DatoUsuarios[j].Apellido_Paterno,
              Rut : this.DatoUsuarios[j].Rut
            })
            this.GrupoUsuarios.push({
              Iduser : usuarios[i].Iduser,
              tipoCuenta: usuarios[i].tipoCuenta
            })
           }
         }
       }
       if(this.estadoTabla == false){
	       const table_actualizar: any = $('#table_actualizar');
	        this.dataTable = table_actualizar.DataTable( {
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
                  {"width": "30%", "className": "text-center"}
              ]
	        });
	        this.estadoTabla = true
       }
       this.TituloGrupo = titulo
       this.indice = indice
    }

    close(){
    	this.GrupoTem = []
    	this.GrupoUsuarios = []
    }

    eliminarModificar(indice) {
      this.GrupoUsuarios.splice(indice, 1)
      this.GrupoTem.splice(indice, 1)
    }
    agregarModificar(nombre, apellido, rut, id, tipo) {
       this.GrupoTem.push({
         Nombre: nombre,
         Apellido: apellido,
         Rut: rut
       })
       this.GrupoUsuarios.push({
        Iduser : id,
        tipoCuenta: tipo
       })
     }

    mostrar (id) {
    for (var i = this.GrupoUsuarios.length - 1; i >= 0; i--) {
     if (this.GrupoUsuarios[i].Iduser == id ) {
      return false
     }
    }
    return true
    }

    modificarGrupo() {
      var contador = 0
      if ( this.TituloGrupo.length > 0) {
        if (this.GrupoTem.length > 0) {
          for(var i=0;i<this.GrupoUsuarios.length;i++){
            if(this.GrupoUsuarios[i].tipoCuenta == 'sec' || this.GrupoUsuarios[i].tipoCuenta == 'jsec' || this.GrupoUsuarios[i].tipoCuenta == 'admces'){
              contador += 1
            }
          }
          if(contador > 1 && this.usuarios.cuentaID.tipo=='esp' || contador > 1 && this.usuarios.cuentaID.tipo=='jsec'){
            this.GrupoUsuarios = []
            this.GrupoTem = []
            this.toastr.warning('Debes seleccionar una sola Cuenta de nivel Superior', 'Error',{
              closeButton: true
            });
          }else{
              this.Grupos[this.indice] = {
              titulo : this.TituloGrupo,
              usuarios : this.GrupoUsuarios.slice()
             }
             let nuevoGrupo = {
              grupos : this.Grupos.slice()
             }
             this._serviciosUsuarios.ActualizarGrupo(nuevoGrupo,this.identificado).subscribe(
              resultado => {
              this.identificado = resultado.token;
              localStorage.setItem("id", this.identificado);
                  this.toastr.success('Grupo Modificado!', 'Respuesta',{
                closeButton: true
              });
             },
             error => {
               this.toastr.error('No se ha podido borrar el grupo!', 'Error',{
                closeButton: true
               });
             })

             this.GrupoUsuarios = []
             this.GrupoTem = []
            }

        } else {
          this.toastr.warning('Debe Ingresar al menos un Usuario al grupo!', 'Grupo sin usuarios',{
				   closeButton: true
			    });
        }
      } else {
        this.toastr.warning('Debe Ingresar el titulo del grupo!', 'Grupo sin Titulo',{
				closeButton: true
			});
	}
	}
}