export class ListaUsuarios{

constructor(
	public _id:string,
	public usuario:string,
	public password:string,
	public cuentaID:string,
	public tipo:string,
	public Nombre:string,
	public Apellido_Paterno:string,
	public Apellido_Materno:string,
	public Rut:string,
	public Cesfam:string,
	public Sector:string,
	public grupos: any[],
	public avisos: any[],
	public imagenPerfilRuta:string
	){}

}