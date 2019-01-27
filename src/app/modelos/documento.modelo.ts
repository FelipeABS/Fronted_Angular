export class Documentos{

constructor(

	public archivo:string,
	public titulo:string,
	public descripcion:string,
	public destinatario: any,
	public grupoDestino: any,
	public confirmarPendiente: any,
	public confirmados: any, 
	public rechazados: any, 
	public fechaCreacion:any,
	public creadorID:string

	){}

}