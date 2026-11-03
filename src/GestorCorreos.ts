import{Correo} from "./Correo";

type ReglasDeEnvio = (correo: Correo) => string | null;

const reglasDeEnvio: ReglasDeEnvio[] = [
  (c) => (!c.getRemitente() ? "El correo debe tener un remitente" : null),
  (c) =>
    c.getDestinatarios().length === 0
      ? "El correo debe tener al menos un destinatario"
      : null,
  (c) =>
    c.getAsunto().trim() === ""
      ? "El correo debe tener un asunto válido"
      : null,
];

export class GestorCorreos {
  private enviados: Correo[] = [];

  public enviar(correo: Correo): void {
    this.validarCorreo(correo);
    this.enviados.push(correo);
  }

    private validarCorreo(correo: Correo): void {
        const errores= reglasDeEnvio
            .map((regla) => regla(correo))
            .filter((mensaje): mensaje is string => mensaje !== null);

    if (errores.length > 0) {
         throw new Error(errores.join("; "));
      }
    }

  public obtenerEnviados(): Correo[] {
    return this.enviados;
  }

}
