import{Correo} from "./Correo";

export class GestorCorreos {
  private enviados: Correo[] = [];

  public enviar(correo: Correo): void {
    this.enviados.push(correo);
  }

  public obtenerEnviados(): Correo[] {
    return this.enviados;
  }

}
