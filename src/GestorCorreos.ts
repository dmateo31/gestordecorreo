import{Correo} from "./Correo";

export class GestorCorreos {
  private enviados: Correo[] = [];

  public enviar(correo: Correo): void {
      if (correo.getDestinatarios().length === 0) {
      throw new Error("El correo debe tener al menos un destinatario");
    }
    this.enviados.push(correo);
  }

  public obtenerEnviados(): Correo[] {
    return this.enviados;
  }

}
